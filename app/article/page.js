"use client";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import React from "react";
import styles from "../../Styles/ArticlePage.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomRenderer from "../components/CustomRenderer";
import supabase from "app/lib/supabase";
import Infobox from "../components/Article/InfoBox";
import removeMarkdown from "../lib/removeMarkdown";
import Navbar from "../components/Navbar";
import remarkGfm from "remark-gfm";
const ArticlePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [article, setArticle] = useState({ content: "" });
  const [allArticles, setAllArticles] = useState([]);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  async function fetchArticle(id) {
    // Fetch all articles
    const { data: data2, error: error2 } = await supabase
      .from("articles")
      .select("*");
    if (error2) {
      console.error("Error fetching all articles:", error2);
    } else {
      setAllArticles(data2);
      console.log("All articles data:", data2);
    }

    // Fetch specific article by ID
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return;
    }

    setArticle(data);
    console.log("removed markdown:", removeMarkdown(data.content));
  }

  function closeGallery() {
    setIsGalleryVisible(false);
  }
  function renderImages(images) {
    if (article.images && article.images.length > 0) {
      if (!isGalleryVisible) {
        console.log(images);
        return (
          <div
            className={styles.firstImage}
            onClick={() => setIsGalleryVisible(true)}
          >
            <div className={styles.overlay}>
              <Image
                src={images[0]}
                alt="Image 1"
                layout="responsive"
                objectFit="contain"
                width={1}
                height={1}
                className={styles.image}
              />
              <span className={styles.overlayText}>View Gallery</span>
            </div>
          </div>
        );
      } else {
        return (
          <>
            <button className={styles.closeButton} onClick={closeGallery}>
              Close Gallery
            </button>
            <div className={styles.imageContainer}>
              {images.map((imageUrl, index) => (
                <div key={index} className={styles.articleImage}>
                  {console.log(imageUrl)}
                  <Image
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    layout="responsive"
                    objectFit="contain"
                    width={1}
                    height={1}
                  />
                </div>
              ))}
            </div>
          </>
        );
      }
    }
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <div className={styles.container}>
        <Navbar />
        <h1 className={styles.title}>{article.title}</h1>
        {article.author && (
          <div className={styles.author}>By {article.author}</div>
        )}
        <Infobox
          title={article.title}
          data={article.form}
          allArticles={allArticles}
        />
        <div className={styles.content}>
          <ReactMarkdown
            className={styles.previewContent}
            components={{
              p: (props) => (
                <p>
                  <CustomRenderer {...props} allArticles={allArticles} />
                </p>
              ),
              li: (props) => (
                <li>
                  <CustomRenderer {...props} allArticles={allArticles} />
                </li>
              ),
            }}
            remarkPlugins={[remarkGfm, { singleTilde: false }]}
          >
            {article.content}
          </ReactMarkdown>
        </div>
        {article.images && <h2>Gallery</h2>}
        {article.images && renderImages(article.images)}
        {/* You can add more elements such as author, date, and images */}
      </div>
    </React.Fragment>
  );
};

export default ArticlePage;
