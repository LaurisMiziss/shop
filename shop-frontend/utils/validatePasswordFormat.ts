export const validatePasswordFormat = (password: string): boolean => {
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return false;
  } else {
    return true;
  };
}