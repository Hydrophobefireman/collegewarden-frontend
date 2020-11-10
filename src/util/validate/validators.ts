export type ValidationResponse = [boolean, string?];

export const MAX_LENGTH = 30;
export const MIN_LENGTH = 4;

export const sanitizeRegExp = /([^\w])/g;
export const clean = (x: string): string =>
  (x + "").replace(sanitizeRegExp, "");
function validateRequiredString(
  name: string,
  dontStripWhitespace?: boolean
): boolean {
  if (!name || !(dontStripWhitespace ? name : name.trim()).length) {
    return false;
  }
  return true;
}
function validateUsername(username: string): ValidationResponse {
  if (!validateRequiredString(username))
    return [false, "Username cannot be blank"];
  if (username.length > MAX_LENGTH) return [false, `Username too long`];
  if (username.length < MIN_LENGTH) return [false, "Username too short"];
  if (clean(username) !== username) return [false, "Invalid username"];

  return [true];
}
function validateName(name: string): ValidationResponse {
  if (!validateRequiredString(name)) {
    return [false, "Name cannot be blank"];
  }

  if (name.length > MAX_LENGTH) {
    return [false, `Name too long`];
  }
  return [true];
}

function validatePassword(password: string): ValidationResponse {
  if (!validateRequiredString(password, true)) {
    return [false, "Password cannot be blank"];
  }
  if (password.length < MIN_LENGTH) {
    return [false, "Password too short"];
  }
  return [true];
}

const BLANK_ERROR_USERNAME = validateUsername("")[1];
const BLANK_ERROR_NAME = validateName("")[1];
const BLANK_ERROR_PASSWORD = validatePassword("")[1];

export {
  validateName,
  validatePassword,
  validateUsername,
  BLANK_ERROR_USERNAME,
  BLANK_ERROR_NAME,
  BLANK_ERROR_PASSWORD,
};
