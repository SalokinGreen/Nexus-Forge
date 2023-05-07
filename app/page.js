"use client";
import React from "react";
import Image from "next/image";
import styles from "../Styles/page.module.css";
import Head from "next/head";
import ArticlePreview from "./components/Article/ArticlesPreview";
import { useState, useEffect } from "react";
// import supabase from "./lib/supabase";
import Navbar from "./components/Navbar";
import { useSupabase } from "./supabase-provider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [newArticles, setNewArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
  const categories = [
    "People",
    "Races",
    "Locations",
    "Events",
    "Items",
    "Laws of the World",
    "Magic",
    "Organizations",
    "Religions",
    "Technologies",
    "Traditions",
    "Politics",
    "Creatures",
    "Flora",
    "Geography",
    "History",
    "Structure",
    "Other",
  ];
  const cs = {
    infinite: false,
    arrows: true,
    slidesToShow: 6,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
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
  const groupedArticles = newArticles.reduce((acc, article) => {
    if (!acc[article.type]) {
      acc[article.type] = [];
    }
    acc[article.type].push(article);
    return acc;
  }, {});

  const categoriesWithArticles = categories.filter(
    (category) =>
      groupedArticles[category.toLowerCase()] &&
      groupedArticles[category.toLowerCase()].length
  );
  return (
    <div className={styles.container}>
      <Navbar />
      <Head>
        <title>
          {process.env.WORLD_TITLE ? process.env.WORLD_TITLE : "Nexus-Forge"}
        </title>
        <meta
          name="description"
          content={
            process.env.WORLD_DESC
              ? process.env.WORLD_DESC
              : "A place to forge and share your worlds."
          }
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {process.env.WORLD_TITLE ? process.env.WORLD_TITLE : "Nexus-Forge"}
        </h1>
        <p className={styles.description}>
          {process.env.WORLD_DESC
            ? process.env.WORLD_DESC
            : "Explore, create, and share your own worlds and stories!"}
        </p>
        {!loading && (
          <>
            <section className={styles.articlesSection}>
              <h2>Favorite</h2>
              <Slider {...cs}>
                {favoriteArticles.map((article) => (
                  <ArticlePreview
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    content={article.content}
                    images={article.images}
                  />
                ))}
              </Slider>
            </section>

            <section className={styles.articlesSection}>
              <h2>New</h2>
              <Slider {...cs}>
                {newArticles.map((article) => (
                  <ArticlePreview
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    content={article.content}
                    images={article.images}
                  />
                ))}
              </Slider>
            </section>
            {categoriesWithArticles.map((category) => (
              <section className={styles.articlesSection} key={category}>
                <h2>{category}</h2>
                <Slider {...cs}>
                  {groupedArticles[category.toLowerCase()].map((article) => (
                    <ArticlePreview
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      content={article.content}
                      images={article.images}
                    />
                  ))}
                </Slider>
              </section>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
