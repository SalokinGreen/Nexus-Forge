import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "../../Styles/Navbar.module.css";
import { useRouter } from "next/navigation";
import ArticlePreview from "./Article/ArticlesPreview";
import { useSupabase } from "../supabase-provider";

const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchContainer = useRef(null);
  // fetch articles from database
  const { supabase } = useSupabase();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase.from("articles").select("*");
      if (error) {
        console.log(error);
      } else {
        setArticles(data);
      }
    };
    fetchArticles();
  }, []);

  // handle click on links
  const handleClick = (address) => {
    router.push(address);
  };

  const searchArticles = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);
    } else {
      const searchTermLowerCase = e.target.value.toLowerCase();

      const titleResults = articles.filter((article) =>
        article.title.toLowerCase().includes(searchTermLowerCase)
      );

      const keywordResults = articles.filter((article) => {
        if (titleResults.includes(article)) {
          return false;
        }
        return article.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTermLowerCase)
        );
      });

      setSearchResults(titleResults.concat(keywordResults));
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() !== "") {
      const filteredArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredArticles);
    }
  };

  const handleClickOutside = (event) => {
    if (
      searchContainer.current &&
      !searchContainer.current.contains(event.target)
    ) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar} ref={searchContainer}>
      <div className={styles.left}>
        <p className={styles.navLink} onClick={() => handleClick("/")}>
          Home
        </p>
      </div>
      <div className={styles.right}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={searchArticles}
          onFocus={handleInputFocus}
          className={styles.searchInput}
        />
        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((article) => (
              <ArticlePreview
                key={article.id}
                id={article.id}
                title={article.title}
                content={article.content}
                images={article.images}
              />
            ))}
          </div>
        )}
      </div>
      {/* <div className={styles.right}>
        <p className={styles.navLink} onClick={() => handleClick("/dashboard")}>
          Dashboard
        </p>
      </div> */}
    </nav>
  );
};

export default Navbar;
