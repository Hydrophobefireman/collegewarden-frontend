export function nextEvent(obj: EventTarget, evt: string) {
  return new Promise((resolve) =>
    obj.addEventListener(evt, resolve, { once: true })
  );
}
export async function getArrayBufferFromUser() {
  //   console.log("ok");
  const input = document.createElement("input");
  input.type = "file";
  const next = nextEvent(input, "change");
  input.click();
  await next;
  const file = input.files[0];
  return { buf: await asArrayBuffer(file), name: file.name, type: file.type };
}

function asArrayBuffer(f: File): Promise<ArrayBuffer> {
  return new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(f);
  });
}
