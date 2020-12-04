import * as requests from "../../util/http/requests";

import {
  CollegeData,
  FileData,
  colleges,
  didFetch,
  files,
  passwordData,
} from "../../state";
import {
  Router,
  redirect,
  useEffect,
  useState,
} from "@hydrophobefireman/ui-lib";
import { center, mask } from "../../styles";
import { get, set, useSharedState } from "statedrive";
import { useLocation, useRequiredAuthentication } from "../../customHooks";

import { CollegeTab } from "./DashboardTabs/CollegeTab";
import { DashboardNav } from "./DashboardNav";
import { Files } from "./DashboardTabs/FilesTab";
import { PasswordInput } from "../../components/PasswordInput";
import { Search } from "./DashboardTabs/SearchTab";
import { SnackBar } from "../../components/SnackBar";
import { dashboardDataSection } from "./Dashboard.styles";
import { decryptJson } from "../../crypto/decrypt";
import { evictWeakMapCache } from "../../components/FileInfo/FileUtil";
import { fileRoutes } from "../../util/http/api_routes";
import { validateCollegeDataWithNewApi } from "./_api2";

interface DashboardProps {
  params: { [k: string]: string };
}
interface UserAlert {
  message?: string;
  isError?: boolean;
}
export default function Dashboard(props: DashboardProps) {
  const location = useLocation();
  useRequiredAuthentication("/dashboard");
  const [message, setMessage] = useState<UserAlert>({
    message: "",
    isError: false,
  });

  const tab = props.params.tab || "colleges";
  useEffect(() => {
    const expectedPath = `/dashboard/${tab}`;
    if (Router.path !== expectedPath) {
      console.log("redirecting");
      redirect(expectedPath);
    }
  }, [tab]);

  const [collegeData, setCData] = useSharedState(colleges);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useSharedState(passwordData);
  const [downloadRes, setDownloadRes] = useState(null);
  useEffect(() => {
    !collegeData && setLoading(true);
    const { controller, result } = requests.get<{ info_dict: FileData }>(
      fileRoutes.getInfoDict
    );
    (async () => {
      const { data, error } = await result;
      setLoading(false);
      if (error) {
        setLoading(false);
        return setMessage({ message: error, isError: true });
      }
      const infoDict = data.info_dict;
      if (!infoDict) {
        setLoading(false);

        return;
      }
      const { file_id, file_enc_meta } = infoDict;
      const downloadResult = await requests.getBinary(
        fileRoutes.download(file_id)
      ).result;
      setLoading(false);
      if (downloadResult instanceof ArrayBuffer) {
        return setDownloadRes({ res: downloadResult, file_enc_meta });
      }
      return setMessage({ message: downloadResult.error, isError: true });
    })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!downloadRes || !pass) return;
    const { res, file_enc_meta } = downloadRes;
    (async () => {
      const resp = await decryptJson(
        { encryptedBuf: res, meta: file_enc_meta },
        pass
      );

      if (resp.error) {
        setPass("");
        const prevFiles = get(files);
        if (prevFiles && prevFiles.length) {
          // the weakmap has erroneously cached
          // the incorrectly decrypted filenames
          // we could either clone all the FileData
          // objects individually (since it's a weakmap, we don't really face a memory leak)
          // or we could just evict them ourselves
          // which is better than cloning multiple objects again and again
          prevFiles.forEach(evictWeakMapCache);
        }
        return setMessage({
          message: resp.error || "could not decrypt",
          isError: true,
        });
      }
      set(didFetch, true);
      return setCData(await validateCollegeDataWithNewApi(resp));
    })();
  }, [downloadRes, pass]);

  return (
    <div>
      {loading && (
        <div class={mask}>
          <loading-spinner />
        </div>
      )}
      {!pass && <PasswordInput />}
      <SnackBar
        message={message.message}
        isError={message.isError}
        onClose={() => setMessage({})}
      />
      <DashboardNav location={location} />
      <section class={dashboardDataSection}>
        <DashboardRoutes
          tab={tab}
          setMessage={setMessage}
          collegeData={collegeData}
        />
      </section>
    </div>
  );
}

function DashboardRoutes({
  tab,
  setMessage,
  collegeData,
}: {
  tab: string;
  setMessage: (err?: unknown) => void;
  collegeData: CollegeData[];
}) {
  switch (tab) {
    case "colleges":
      return <CollegeTab setMessage={setMessage} collegeData={collegeData} />;
    case "files":
      return <Files setMessage={setMessage} />;
    case "search":
      return <Search setMessage={setMessage} />;
    default:
      return <div class={center}>The requested URL was not found</div>;
  }
}
