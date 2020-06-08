export const detectBrowser = () => {
  const ua = window.navigator.userAgent;
  // check if IE10
  const msie = ua.indexOf('MSIE ');

  if (msie > 0) {
    return false;
  }
  return true;
};
