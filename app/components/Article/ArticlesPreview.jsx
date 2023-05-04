import React from "react";
import styles from "../../../Styles/Article.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
const ArticlePreview = ({ title, content, id, images }) => {
  console.log("images:", images);
  const router = useRouter();
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
          alt="Image 1"
          layout="responsive"
          objectFit="contain"
          width={1}
          height={1}
          className={styles.image}
        />
      )}
      <h3>{title}</h3>
      {/* <p>{content}</p> */}
    </div>
  );
};

export default ArticlePreview;
