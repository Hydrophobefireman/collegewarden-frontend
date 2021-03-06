import { IntdeterminateLoader } from "../LoadingIndicator";

export function ChunkLoading(...a: any[]): JSX.Element;
export function ChunkLoading({ size }: { size?: number | string }) {
  return (
    <>
      <IntdeterminateLoader />
      {
        // @ts-ignore
        <loading-spinner size={size}>Loading...</loading-spinner>
      }
    </>
  );
}
