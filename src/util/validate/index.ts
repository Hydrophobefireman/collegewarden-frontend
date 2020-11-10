import * as validators from "./validators";

export interface PopupMessage {
  message?: string;
  isError?: boolean;
  onClose?(): any;
}
function _validate(
  func: "validateName" | "validatePassword" | "validateUsername",
  k: string,
  setMessage: (opt: PopupMessage) => unknown
) {
  let [valid, reason] = validators[func](k);
  if (!valid) {
    setMessage({ message: reason, isError: true });
    return true;
  }
}
export function validateName(
  name: string,
  setMessage: (opt: PopupMessage) => unknown
) {
  return _validate("validateName", name, setMessage);
}

export function validatePassword(
  p: string,
  setMessage: (opt: PopupMessage) => unknown
) {
  return _validate("validatePassword", p, setMessage);
}

export function validateUsername(
  u: string,
  setMessage: (opt: PopupMessage) => unknown
) {
  return _validate("validateUsername", u, setMessage);
}
