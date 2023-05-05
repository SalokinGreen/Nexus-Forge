"use client";
import styles from "../../Styles/Dashboard.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Settings from "../components/Dashboard/Settings";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
import { useSupabase } from "../supabase-provider";
import { ImHammer2 } from "react-icons/im";
import LoginPage from "../components/LoginPage";
function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const router = useRouter();
  const { supabase } = useSupabase();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
  if (!session) {
    console.log("session missing");
    return <LoginPage />;
  } else {
    console.log("got it");
    return (
      <div className={styles.dashboard}>
        <DashboardNavbar />
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
        <button
          className={styles.createButton}
          onClick={() => router.push("/write")}
        >
          <ImHammer2 size={"3em"} />
        </button>
      </div>
    );
  }
}

export default Dashboard;
