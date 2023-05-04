"use client";
import React from "react";
import Image from "next/image";
import styles from "../Styles/page.module.css";
import Head from "next/head";
import ArticlePreview from "./components/Article/ArticlesPreview";
import { useState, useEffect } from "react";
import supabase from "./lib/supabase";
import Navbar from "./components/Navbar";

export default function Home() {
  const [favoriteArticles, setFavoriteArticles] = useState([
    { id: 1, title: "test", content: "test", images: [] },
  ]);
  const [newArticles, setNewArticles] = useState([
    { id: 2, title: "test", content: "test", images: [] },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      const { data: favoriteArticles } = await supabase
        .from("articles")
        .select("*")
        .eq("favorite", true);

      const { data: newArticles } = await supabase
        .from("articles")
        .select("*")
        .eq("favorite", false)
        .order("created_at", { ascending: false });

      setFavoriteArticles(favoriteArticles);
      setNewArticles(newArticles);
      setLoading(false);
    }

    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <Head>
        <title>World-Building App</title>
        <meta name="description" content="Welcome to the World-Building App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Nexus-Forge</h1>
        <p className={styles.description}>
          Explore, create, and share your own worlds and stories!
        </p>
        {!loading && <>
        <section className={styles.articlesSection}>
          <h2>Favorite Articles</h2>
          <div className={styles.articles}>
            {favoriteArticles.map((article) => (
              <ArticlePreview
                key={article.id}
                id={article.id}
                title={article.title}
                content={article.content}
                images={article.images}
              />
            ))}
          </div>
        </section>

        <section className={styles.articlesSection}>
          <h2>New Articles</h2>
          <div className={styles.articles}>
            {newArticles.map((article) => (
              <ArticlePreview
                key={article.id}
                id={article.id}
                title={article.title}
                content={article.content}
                images={article.images}
              />
            ))}
          </div>
        </section></>}
      </main>
    </div>
  );
}
