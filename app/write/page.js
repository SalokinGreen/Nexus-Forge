"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import supabase from "../lib/supabase";
import styles from "./Write.module.css";
import withAuth from "../lib/withAuth";
import Template from "../components/Template";
import Image from "next/image";

function Write() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");

  const [templateData, setTemplateData] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const template = searchParams.get("template");
  const [showPreview, setShowPreview] = useState(false);
  const availableTypes = ["character", "location", "item"];
  const [uploadedImage, setUploadedImage] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toDelete, setToDelete] = useState([]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    } else if (template) {
      setType(template);
      setSelectedFiles([]);
    }
  }, [articleId]);

  async function fetchArticle() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (error) {
      console.error("Error fetching article:", error);
      return;
    }

    setTitle(data.title);
    setAuthor(data.author);
    setType(data.type);
    setContent(data.content);
    setTemplateData(data.form);
    setUploadedImage(data.images);
    setKeywords(data.keywords);
    // setSelectedFiles(data.images.map((imageUrl) => ({ url: imageUrl.url })));
  }
  function sanitizeFileName(fileName) {
    // Replace invalid characters with '-'
    const sanitizedFileName = fileName.replace(/[^\w.-]+/g, "-");
    return sanitizedFileName;
  }
  async function handleSubmit(e) {
    e.preventDefault();

    // Upload images
    let uploadedImageUrls = [];
    for (const fileData of selectedFiles) {
      // If the file object is present, upload the image
      if (fileData.file) {
        const sanitizedFileName = sanitizeFileName(
          `${Date.now()}-${fileData.file.name}`
        );
        const { error } = await supabase.storage
          .from("images")
          .upload(sanitizedFileName, fileData.file);

        if (error) {
          console.error("Error uploading image:", error);
          return;
        }

        const imageUrl = supabase.storage
          .from("images")
          .getPublicUrl(sanitizedFileName);
        uploadedImageUrls.push(imageUrl.data.publicUrl);
      } else {
        // If the file object is not present, add the URL directly
        uploadedImageUrls = selectedFiles;
      }
    }

    // Save article with uploaded image URLs
    let result;

    if (articleId) {
      await updateArticle(uploadedImageUrls);
    } else {
      await createArticle(uploadedImageUrls);
    }
  }

  async function createArticle(newImages) {
    const { error } = await supabase.from("articles").insert([
      {
        author,
        type,
        content,
        title,
        form: templateData,
        created_at: new Date(),
        images: newImages,
        keywords,
      },
    ]);

    if (error) {
      console.error("Error creating article:", error);
    } else {
      router.push("/dashboard");
    }
  }

  async function updateArticle(newImages) {
    const { error } = await supabase
      .from("articles")
      .update({
        author,
        type,
        content,
        title,
        form: templateData,
        images: [...uploadedImage, ...newImages],
        keywords,
      })
      .eq("id", articleId);

    if (error) {
      console.error("Error updating article:", error);
    } else {
      // Delete images that were removed
      if (toDelete.length > 0) {
        const { data, error: storageError } = await supabase.storage
          .from("images")
          .remove(toDelete);

        if (storageError) {
          console.error("Error deleting image from storage:", storageError);
          return;
        }
      }
      router.push("/dashboard");
    }
  }
  async function deleteArticle() {
    if (!articleId) return;

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);

    if (error) {
      console.error("Error deleting article:", error);
    } else {
      router.push("/dashboard");
    }
  }

  function togglePreview() {
    setShowPreview((prevShowPreview) => !prevShowPreview);
  }

  async function handleDeselectImage(index, link) {
    const file = selectedFiles[index];
    try {
      // Delete existing image from storage

      setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      deleteImage(selectedFiles[index].url);
    } catch (error) {}

    if (!file) return;
    // Remove the image from the selectedFiles state
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }
  async function handleDeleteImage(index, link) {
    const file = uploadedImage[index];
    try {
      // Delete existing image from storage

      setUploadedImage((prevFiles) => prevFiles.filter((_, i) => i !== index));
      deleteImage(uploadedImage[index]);
    } catch (error) {}

    if (!file) return;
    const pathImage = uploadedImage[index].split("/").pop();
    setToDelete((prevFiles) => [...prevFiles, pathImage]);
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(async (file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFiles((prevFiles) => [
          ...prevFiles,
          { url: reader.result, file },
        ]);
      };
      reader.readAsDataURL(file);
    });
  }

  function ImagePreviews({ files, onDelete }) {
    return (
      <div className={styles.imagePreviews}>
        {files.map((file, index) => (
          <div key={index} className={styles.imagePreviewContainer}>
            <Image
              src={file.url || file}
              alt={file.file?.name || file}
              className={styles.imagePreview}
              width={150}
              height={150}
              objectFit="cover"
            />
            <button
              className={styles.deleteImageButton}
              onClick={() => onDelete(index, file.url)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  }
  function addKeyword() {
    if (newKeyword.trim()) {
      setKeywords((prevKeywords) => [...prevKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  }

  function updateKeyword(index, value) {
    setKeywords((prevKeywords) =>
      prevKeywords.map((keyword, i) => (i === index ? value : keyword))
    );
  }

  function removeKeyword(index) {
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
  }
  function handleKeyPress(e) {
    if (e.key === "Enter" && e.target.className !== styles.textarea) {
      e.preventDefault();
      if (e.target.className === styles.keywordInput) {
        addKeyword();
      }
    } else if (e.key === "Enter" && e.target.className === styles.textarea) {
      // add for generating with NAI api
      // if key enter and alt is pressed
      if (e.altKey) {
        e.preventDefault();
        console.log("generate with NAI api");
      }
    }
  }
  return (
    <div className={styles.container}>
      <h1>Title</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h1>Author</h1>

        <input
          type="text"
          className={styles.input}
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <h1>Keywords</h1>
        <div className={styles.keywordsContainer}>
          {keywords.map((keyword, index) => (
            <div key={index} className={styles.keyword}>
              <span>{keyword}</span>
              <button
                className={styles.removeKeywordButton}
                type="button"
                onClick={() => removeKeyword(index)}
              >
                x
              </button>
            </div>
          ))}
          <input
            type="text"
            className={styles.keywordInput}
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add keyword"
            onKeyDown={handleKeyPress}
          />
          <button
            className={styles.addKeywordButton}
            type="button"
            onClick={addKeyword}
            onSubmit={addKeyword}
          >
            Add
          </button>
        </div>
        <h1>Type</h1>

        <select
          className={styles.selectField}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {availableTypes.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {typeOption}
            </option>
          ))}
        </select>
        <h1>Content</h1>

        <textarea
          className={styles.textarea}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button className={styles.button} onClick={handleSubmit}>
          {articleId ? "Update" : "Create"}
        </button>
        {articleId && (
          <button className={styles.button} onClick={deleteArticle}>
            Delete
          </button>
        )}
        <button className={styles.button} type="button" onClick={togglePreview}>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
        {showPreview && (
          <div className={styles.previewContainer}>
            <ReactMarkdown className={styles.previewContent}>
              {content}
            </ReactMarkdown>
            <button className={styles.closeButton} onClick={togglePreview}>
              Close
            </button>
          </div>
        )}
      </form>
      <div className={styles.uploadContainer}>
        <label htmlFor="image-upload" className={styles.button}>
          Add Images
        </label>
        <input
          type="file"
          id="image-upload"
          className={styles.uploadInput}
          accept="image/*"
          onChange={handleImageUpload}
          multiple
        />
      </div>
      {selectedFiles.length > 0 && <h2>Selected Images</h2>}
      <ImagePreviews files={selectedFiles} onDelete={handleDeselectImage} />
      {uploadedImage.length > 0 && <h2>Uploaded Images</h2>}
      <ImagePreviews files={uploadedImage} onDelete={handleDeleteImage} />

      <Template
        type={type}
        updateTemplateData={setTemplateData}
        initialData={
          articleId ? templateData : { currentLocation: "", mother: "" }
        }
      />
    </div>
  );
}

export default withAuth(Write);
