export function nextEvent(obj: EventTarget, evt: string) {
  return new Promise((resolve) =>
    obj.addEventListener(evt, resolve, { once: true })
  );
}
export async function getDataFromUser(
  fileData: File[] | null,
  mode: "arrayBuffer" | "string"
) {
  let files: File[] = [];
  if (!fileData) {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    const next = nextEvent(input, "change");
    input.click();
    await next;
    files = Array.from(input.files);
  } else {
    files = fileData;
  }
  return Promise.all(
    files.map(async (file) => ({
      buf:
        mode === "arrayBuffer"
          ? await asArrayBuffer(file)
          : await asString(file),
      name: file.name,
      type: file.type || "application/octet-stream",
    }))
  );
}

function asArrayBuffer(f: File): Promise<ArrayBuffer> {
  return new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(f);
  });
}

function asString(f: File): Promise<string> {
  return new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result as string);
    reader.readAsText(f);
  });
}
