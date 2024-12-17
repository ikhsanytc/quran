export function removeHtmlTags(htmlString: string) {
  return htmlString.replace(/<[^>]*>/g, "");
}
