"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useSupabase } from "../supabase-provider";
import LoginPage from "../components/LoginPage";
import styles from "../../Styles/Write.module.css";
import Template from "../components/Write/Template";
import Image from "next/image";
import axios from "axios";
import remarkGfm from "remark-gfm";
import DashboardNavbar from "../components/Dashboard/DashboardNavbar";
// icons
import {
  AiFillDelete,
  AiFillSave,
  AiFillEye,
  AiFillPlaySquare,
  AiFillFileImage,
  AiFillEyeInvisible,
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
function Write() {
  const { supabase } = useSupabase();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateData, setTemplateData] = useState([{ label: "", value: "" }]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");
  const template = searchParams.get("template");
  const [showPreview, setShowPreview] = useState(false);
  const availableTypes = ["character", "location", "item"];
  const [uploadedImage, setUploadedImage] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [showMemory, setShowMemory] = useState(false);
  const [memory, setMemory] = useState(
    "[ Tags: article, wiki, content; Genre: world-building ]\n***\n"
  );
  const [favorite, setFavorite] = useState(false);
  const memoryEditableRef = useRef(null);
  const onBlurMemory = () => {
    setMemory(memoryEditableRef.current.innerText);
  };
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

  const contentEditableRef = useRef(null);

  const onBlur = (e) => {
    setContent(contentEditableRef.current.innerText);
  };

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
    setMemory(data.memory);
    setFavorite(data.favorite);
    console.log("the original data:", data.form);
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
        memory,
        favorite,
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
        memory,
        favorite,
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
    setContent(contentEditableRef.current.innerText);
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
              <AiFillDelete />
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
  function moveCursorToEndAsync(element) {
    setTimeout(() => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false); // Set to false to move the cursor to the end
      selection.removeAllRanges();
      selection.addRange(range);
      element.focus();
    }, 0);
  }
  async function handleKeyPress(e) {
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
        setContent(contentEditableRef.current.innerText);
        console.log("generate with NAI api");
        await generate();
        moveCursorToEndAsync(contentEditableRef.current);
      }
    } else if (isGenerating && e.target.className === styles.textarea) {
      // if generating and key is pressed
      e.preventDefault();
      console.log("generating");
    }
  }
  // clean string from double spaces, newlines with spaces attached, and double newlines
  function cleanString(string) {
    const lines = string.split("\n");

    let cleanedLines = lines.map((line) => {
      if (line.trim() !== "---") {
        // Remove leading and trailing spaces, and replace multiple spaces with a single space
        line = line.trim().replace(/\s\s+/g, " ");
      }
      return line;
    });

    // Remove any empty lines that are not around '---'
    cleanedLines = cleanedLines.filter((line, index, array) => {
      if (
        line === "" &&
        !(
          (array[index - 1] && array[index - 1].trim() === "---") ||
          (array[index + 1] && array[index + 1].trim() === "---")
        )
      ) {
        return false;
      }
      return true;
    });

    return cleanedLines.join("\n");
  }

  async function generate() {
    // api call to /api/generate
    setContent(contentEditableRef.current.innerText);

    setIsGenerating(true);
    const response = await axios
      .post("/api/generate", {
        content: contentEditableRef.current.innerText,
        memory,
        extra: "",
        type: "krake",
        title,
        key: localStorage.getItem("nai_access_key"),
      })
      .catch((err) => {
        console.log(err);
        setIsGenerating(false);
        return null;
      });
    const data = response.data;
    console.log(data);
    setContent(cleanString(contentEditableRef.current.innerText + " " + data));
    setIsGenerating(false);
  }
  if (!session) {
    console.log("session missing");
    return <LoginPage />;
  } else {
    return (
      <div className={styles.container}>
        <DashboardNavbar />
        <h1>
          Title{" "}
          {favorite ? (
            <AiFillStar onClick={() => setFavorite(!favorite)} />
          ) : (
            <AiOutlineStar onClick={() => setFavorite(!favorite)} />
          )}{" "}
        </h1>
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
          <div className={styles.fieldsRow}>
            <div>
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
            </div>
            <div className={styles.keywordsWrapper}>
              <h1>Keywords</h1>
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
              </div>
            </div>
          </div>
          <h1>Content</h1>
          <div style={{ position: "relative" }}>
            <div
              className={styles.textarea}
              placeholder="Content"
              ref={contentEditableRef}
              contentEditable="true"
              onBlur={onBlur}
              onKeyDown={handleKeyPress}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {isGenerating && (
              <div className={styles.loadingEffect}>
                <span>Generating...</span>
              </div>
            )}
          </div>
          <div className={styles.buttonsArea}>
            <div className={styles.buttonsPart}>
              <button className={styles.button} onClick={handleSubmit}>
                <AiFillSave />
              </button>
              {articleId && (
                <button className={styles.buttonDelete} onClick={deleteArticle}>
                  <AiFillDelete />
                </button>
              )}
              <button
                className={styles.button}
                type="button"
                onClick={togglePreview}
              >
                <AiFillEye />
              </button>
              {showPreview && (
                <div className={styles.previewContainer}>
                  <ReactMarkdown
                    className={styles.previewContent}
                    remarkPlugins={[remarkGfm]}
                  >
                    {content}
                  </ReactMarkdown>
                  <button
                    className={styles.closeButton}
                    onClick={togglePreview}
                  >
                    <AiFillEyeInvisible />
                  </button>
                </div>
              )}
              <div className={styles.uploadContainer}>
                <label htmlFor="image-upload" className={styles.button}>
                  <AiFillFileImage />
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
            </div>
            <div className={styles.buttonsPart}>
              <button
                className={styles.button}
                type="button"
                onClick={() => generate()}
              >
                <AiFillPlaySquare />
              </button>
            </div>
          </div>
        </form>

        {selectedFiles.length > 0 && <h2>Selected Images</h2>}
        <ImagePreviews files={selectedFiles} onDelete={handleDeselectImage} />
        {uploadedImage.length > 0 && <h2>Uploaded Images</h2>}
        <ImagePreviews files={uploadedImage} onDelete={handleDeleteImage} />

        <Template setTemplateData={setTemplateData} formData={templateData} />
        <div className={styles.memory}>
          <h1 onClick={() => setShowMemory(!showMemory)}>
            Memory {showMemory ? <AiFillCaretDown /> : <AiFillCaretUp />}
          </h1>
        </div>
        {showMemory && (
          <div style={{ position: "relative" }}>
            <div
              className={styles.textarea}
              placeholder="Memory"
              ref={memoryEditableRef}
              contentEditable="true"
              onBlur={onBlurMemory}
              dangerouslySetInnerHTML={{ __html: memory }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Write;
