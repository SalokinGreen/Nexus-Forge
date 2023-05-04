"use client";
import styles from "../../Styles/Dashboard.module.css";
import { useState, useEffect } from "react";
import { signOut } from "../lib/auth";
import { useRouter } from "next/navigation";
import supabase from "../lib/supabase";
import withAuth from "../lib/withAuth";

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  const formattedDate = function (date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  async function fetchArticles() {
    const { data, error } = await supabase.from("articles").select("*");

    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }

    setArticles(data);
  }

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  const filteredArticles = articles.filter((article) => {
    const titleMatch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter ? article.type === typeFilter : true;

    return titleMatch && typeMatch;
  });

  function handleCreateArticle(template) {
    // Navigate to the create article page with the selected template
    router.push(`/write?template=${template}`);
  }
  function handleOpenArticle(id) {
    // Navigate to the article page with the selected id
    router.push(`/write?id=${id}`);
  }
  return (
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Dashboard</div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={styles.typeSelect}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {/* Update the options based on the available types */}
          <option value="character">Character</option>
          <option value="type2">Type 2</option>
        </select>
      </div>
      <div className={styles.articles}>
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className={styles.article}
            onClick={() => handleOpenArticle(article.id)}
          >
            <h2 className={styles.articleTitle}>{article.title}</h2>
            <p className={styles.articleDate}>
              Date: {formattedDate(article.created_at)}
            </p>
          </div>
        ))}
      </div>
      <div className={styles.createArticleSection}>
        <h2>Create Article</h2>
        <div className={styles.templateButtons}>
          <button
            className={styles.templateButton}
            onClick={() => handleCreateArticle("character")}
          >
            Character
          </button>
          <button
            className={styles.templateButton}
            onClick={() => handleCreateArticle("location")}
          >
            Location
          </button>
          {/* Add more template buttons as needed */}
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
