export function getBaseUrl(url?: string) {
  if (!url) {
    return url;
  }

  if (url.indexOf('?') === -1) {
    return url;
  }
  return url.split('?')[0];
}
