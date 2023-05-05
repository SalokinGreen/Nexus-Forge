export default function cleanChatString(str) {
  // If there's a '>', remove it and everything after it
  if (str.includes(">")) {
    str = str.substring(0, str.indexOf(">"));
  }
  // If there's a space or multiple at the end of the string, remove it
  if (str.endsWith(" ")) {
    str = str.substring(0, str.lastIndexOf(" "));
  }
  // If there's a space or multiple at the start of the string, remove it
  if (str.startsWith(" ")) {
    str = str.substring(str.indexOf(" "));
  }
  // Reutrn the string
  return str;
}
