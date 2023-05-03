import ReactMarkdown from "react-markdown";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import linkifyPlugin from "../lib/linkifyPlugin";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import TextRenderer from "./TextRenderer";

const ArticleContent = ({ content, allArticles }) => {
  console.log("all:", allArticles);
  const components = {
    // Replace the default text renderer with the custom TextRenderer
    text: (props) => <TextRenderer {...props} allArticles={allArticles} />,
  };

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkParse, remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  );
};

export default ArticleContent;
