import {
  redirect,
  Router,
  useEffect,
  useState,
} from "@hydrophobefireman/ui-lib";
import { SnackBar } from "../../components/SnackBar";
import { useLocation, useRequiredAuthentication } from "../../customHooks";
import { center, mask } from "../../styles";
import { CollegeTab } from "./DashboardTabs/CollegeTab";
import { dashboardDataSection } from "./Dashboard.styles";
import { DashboardNav } from "./DashboardNav";
import { Files } from "./DashboardTabs/FilesTab";
import { Search } from "./DashboardTabs/SearchTab";
import { set, useSharedState } from "statedrive";
import {
  CollegeData,
  colleges,
  didFetch,
  FileData,
  passwordData,
} from "../../state";
import { PasswordInput } from "../../components/PasswordInput";
import * as requests from "../../util/http/requests";
import { fileRoutes } from "../../util/http/api_routes";
import { decryptJson } from "../../crypto/decrypt";
import { ChunkLoading } from "../../components/ChunkLoadingComponent";
import { IntdeterminateLoader } from "../../components/LoadingIndicator";

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
  useEffect(() => {
    if (!pass) return;
    !collegeData && setLoading(true);
    const { controller, result } = requests.get<{ info_dict: FileData }>(
      fileRoutes.getInfoDict
    );
    (async () => {
      set(didFetch, true);
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
        const resp = await decryptJson(
          { encryptedBuf: downloadResult, meta: file_enc_meta },
          pass
        );
        if (resp.error) {
          setPass("");

          return setMessage({
            message: resp.error || "could not decrypt",
            isError: true,
          });
        }
        return setCData(resp);
      }

      return setMessage({ message: downloadResult.error, isError: true });
    })();
    return () => controller.abort();
  }, [pass]);

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
