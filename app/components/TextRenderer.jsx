import React from "react";
import Link from "next/link";

const TextRenderer = ({ node, allArticles }) => {
  const articlesMap = {};

  allArticles.forEach((article) => {
    articlesMap[article.content.title] = article.id;
    article.keywords.forEach((keyword) => {
      articlesMap[keyword] = article.id;
    });
  });

  if (articlesMap[node.value]) {
    const id = articlesMap[node.value];
    return (
      <Link href={`/article?id=${id}`}>
        <a>{node.value}</a>
      </Link>
    );
  }

  return <>{node.value}</>;
};

export default TextRenderer;
