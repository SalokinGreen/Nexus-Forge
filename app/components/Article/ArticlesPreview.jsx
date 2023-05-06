import React from "react";
import styles from "../../../Styles/Article.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
const ArticlePreview = ({ title, content, id, images }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  console.log("images:", images);
  let image = false;
  if (typeof images === "object" && images.length > 0) {
    image = true;
  }
  //on click go to article page
  const handleClick = () => {
    router.push(`/article?id=${id}`);
  };
  return (
    <div className={styles.article} onClick={handleClick}>
      {image && (
        <Image
          src={images[0]}
          alt="Image of article"
          height={133}
          width={200}
          className={styles.image}
        />
      )}
      <h3>{title}</h3>
      {/* <p>{content}</p> */}
    </div>
  );
};

export default ArticlePreview;
