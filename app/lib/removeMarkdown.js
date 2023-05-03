export default function removeMarkdown(str) {
  const rules = [
    // Remove headers
    // [/^(#+)(.*)/gm, ""],
    // Remove bold, italic, strikethrough
    [/(\*\*|__)(.*?)\1/g, "$2"],
    [/(\*|_)(.*?)\1/g, "$2"],
    [/(\~\~)(.*?)\1/g, "$2"],
    // Remove links
    [/\[(.*?)\]\(.*?\)/g, "$1"],
    // Remove images
    [/!\[(.*?)\]\(.*?\)/g, ""],
    // Convert lists to hyphens
    [/^(\s*)([\*\+-]|\d+\.)\s+/gm, "$1- "],
    // Remove blockquotes
    [/^(\s*)>\s+/gm, "$1"],
    // Replace horizontal rule with 4 hyphens
    [/^(-\s{2,}|\*\s{2,}|\_\s{2,})\n/gm, "----\n"],
    // Remove code blocks
    [/```[^`]*```/gm, ""],
    // Remove inline code
    [/`[^`]*`/gm, ""],
    // Remove HTML tags
    [/<[^>]*>/gm, ""],
    // Replace multiple spaces with a single space
    [/ +/g, " "],
    // Remove spaces before and after newlines
    [/\s*\n\s*/g, "\n"],
    // Replace multiple newlines with a single newline
    [/\n{2,}/g, "\n"],
  ];

  return rules.reduce(
    (acc, [regex, replacement]) => acc.replace(regex, replacement),
    str
  );
}
