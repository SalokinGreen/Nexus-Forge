import React from "react";
import styles from "../../../Styles/Article.module.css";
import Image from "next/image";

import { useRouter, usePathname } from "next/navigation";
const ArticlePreview = ({ title, content, id, images }) => {
  const router = useRouter();
  const pathname = usePathname();
  let image = false;
  if (typeof images === "object" && images.length > 0) {
    image = true;
  }
  //on click go to article page if on "/" or "/article", and go to write page if on "/write" or "dashboard"
  const handleClick = () => {
    if (pathname === "/write" || pathname === "/dashboard") {
      router.push(`/write?id=${id}`);
    } else {
      router.push(`/article?id=${id}`);
    }
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
