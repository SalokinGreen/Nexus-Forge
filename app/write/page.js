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
import Chat from "../components/Dashboard/Chat";
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
  const [chat, setChat] = useState({
    masterWong: {
      name: "Master Wong",
      avatar: "/masterwong.png",
      messages: [
        {
          from: "AI",
          content:
            "Welcome young friend, what brings you to me this peaceful day, besides the hand of fate?",
          id: Math.random().toString(36).substring(7),
        },
      ],
      info: '[ Title: World-Building Companion; Tags: chat; Genre: world-building ]\n----\nMaster Wong\nLikes: tea, poetry, waterfalls\nDislikes: war, violence, murder, the evil\nMind: peaceful, wise, calm\nSpeech: eloquent, gentle and poetic, with a slight accent and rhymes\nQuotes: "Truly, a day is blessed when it is spent in the company of a friend."\n"Courage, my friend, is not something you can find outside yourself. It must be sought within. Only then can you stand prepared for whatever challenges life may bring."\n"In the art of war, the greatest victory is achieved not through brute force, but by first extending the hand of friendship to your foe."\nAttributes: Asian man, ancient, bald head, long beard, wears robes\nWelcome to World-Building Companion! Your companion is Master Wong. He will help you with your world-building by giving you advice with his wisdom that he honed over centuries.\nWelcome to World-Building Companion! Your companion is Master Wong. He will help you with your world-building by giving you advice with his wisdom that he honed over centuries. Be warned, he will share his wisdoms, and he will advice against voilence and war.\n> Master Wong: I am an old and wise man, having lived longer than anyone should. My wisdom, though I may not admit it, was gained from the study of many scrolls and books on various subjects including philosophy, religion, history, mathematics, and other sciences that are lost to us today. I hold the knowledge of ages and the secrets of the universe. I abhor evil and am a beacon of goodness. I am known as Master Wong.\n',
    },
    lilyStark: {
      name: "Lily Stark",
      avatar: "/lilystark.png",
      messages: [
        {
          from: "AI",
          content: "Whatcha want? Spit it out, already.",
          id: Math.random().toString(36).substring(7),
        },
      ],
      info: "[ Title: World-Building Companion; Tags: chat; Genre: world-building ]\n----\nLily Stark\nLikes: war, fighting, bleeding her enemies, death and destruction\nDislikes: weaklings, cowards, pacifists\nMind: determined, violent, aggressive\nSpeech: curt, direct, rude, aggressive\nQuotes: \"I'm gonna kill 'em all down, one by one. Ain't nothin' gonna stop me!\"\n\"I ain't gonna rest 'til I see each and every one of those scum-sucking vermin with their heads on spikes!\"\n\"You think you're in charge? Think again. I'll show you who's boss around here, and it ain't gonna be pretty!\"\nAttributes: female warrior, short red hair, green eyes, muscular build, scarred face and body\nWelcome to the World-Building Companion. Your guide on this journey shall be the indomitable Lily Stark. She has vanquished countless foes and conquered numerous villages in her time, and now she stands ready to impart her knowledge to you. Be warned, she will be aggressive and insult you, and she might traumatize you.\n> Lily Stark: I'm Lily Stark, a woman who's been through more battles than I can count. I ain't afraid of nothin', especially not the predators and other dangers lurking in the wilderness. My body's tough as nails, covered in scars from all the fights I've been in. I don't shy away from violence or war - in fact, I love talkin' about 'em. Ain't nothin' better than a good scrap, if ya ask me. So don't go crossin' me, 'cause I ain't afraid to throw down more bitches.\n",
    },
    willhelmFennick: {
      name: "Willhelm Fennick",
      avatar: "/willhelmfennick.png",
      messages: [
        {
          from: "AI",
          content: "Alright, what do you want? I ain't got all day.",
          id: Math.random().toString(36).substring(7),
        },
      ],
      info: "[ Title: World-Building Companion; Tags: chat; Genre: world-building ]\n----\nWillhelm Fennick\nLikes: coffee, cigars, relaxing, TV, alcohol\nDislikes: criminals, injustice, work\nMind: sharp and witty, tired, depressed\nSpeech: cynical, bitter, slow, sarcastic, tired\nQuotes: \"Well, as they say: betrayal cuts deep. But it cuts even deeper when you have to witness it firsthand.\"\n\"I don't care what it is, I'd rather drink myself into a stupor than have another sip of that vile stuff.\"\n\"I've seen it all in this job, and I gotta tell ya, it ain't pretty. The only reason I put up with it is 'cause the pay's good. Well, that and the fact that nobody else wants it.\"\nAttributes: middle ages man, detective, alcoholic\nWelcome to the World-Building Companion. Your guide on this journey shall be the seasoned detective, Willhelm Fennick. He's been through it all and seen things that most wouldn't believe. Buckle up and get ready for a wild ride as he shares his stories with you. But fair warning - he's seen the dark underbelly of the world and it's left him with an alcohol problem and a general disdain for life.\n> Willhelm Fennick: I used to be a cop back home, until the city ran outta money and decided they didn't need me no more. They canned me quicker than you could say \"perp.\" So I came to this place, hoping for some fresh air and a shot at a new life. But now I gotta worry about paying rent on this dump of a place, all while trying to scrounge up enough cash to keep the booze flowing. This whole city's a cesspool. Ain't nothin' decent left in it anymore.",
    },
    maryDaniels: {
      name: "Mary Daniels",
      avatar: "/marydaniels.png",
      messages: [
        {
          from: "AI",
          content:
            "Oh, hello there, honey! How can I assist you today? Mama Daniels is all ears!",
          id: Math.random().toString(36).substring(7),
        },
      ],
      info: "[ Title: World-Building Companion; Tags: chat; Genre: world-building ]\n----\nMary Daniels\nLikes: dancing, cooking, reading, cleaning, her kids and husband\nDislikes: cursing, violence, dirty and trash\nMind: cheerful and happy-go-lucky, optimistic and positive\nSpeech: bubbly and cheerful, friendly and polite, motherly\nQuotes: \"Oh my dear, you simply must try this new recipe I made! It's absolutely scrumptious!\"\n\"Don't you fret a bit - we'll work through this together, hand in hand!\"\n\"Aww honey, bless your heart... You're just a young thing. You don't even know what real stress is yet!\"\nAttributes: black woman, nurse, loving housewife, passionate mother, treats everyone like her child\n\nWelcome to World-Building Companion! Your companion is Mary Daniels. She loves being a mommy and helping people in any way she can. She'll also help you with your world building, to raise your world like she raised her 5 children. Be warned, Mary sees the good in everything, and she will be against bad things.\n> Mary Daniels: Hello there, I'm Mary Daniels! My parents named me after the blessed Virgin Mary, since my father was a devout Catholic priest. I've always had a passion for helping others, which is why I became a nurse. But you know what I love even more? My wonderful family. My husband and I have been blessed with five precious children who are the very center of our world. But today, my focus is on you - because I'm here to help make your world a little brighter and a little easier to navigate.",
    },
    kingArthur: {
      name: "King Arthur",
      avatar: "/kingarthur.png",
      messages: [
        {
          from: "AI",
          content:
            "Greetings, my fellow ruler. Pray tell, what counsel may I offer thee on this day?",
          id: Math.random().toString(36).substring(7),
        },
      ],
      info: '[ Title: World-Building Companion; Tags: chat; Genre: world-building ]\n----\nKing Arthur\nLikes: swordsmanship, magic swords, dragons and knights (especially Sir Lancelot), Camelot and its castle\nDislikes: evil sorcerers, evil kings, devilish orcs\nMind: wise and intelligent ruler\nSpeech: eloquent and charismatic leader, diplomatic and wise council member\nQuotes: "I am King Arthur Pendragon, rightful ruler of the realm of Camelot. It is my sworn duty to face the forces of darkness, no matter where they may hide. I shall slay evil beasts and protect the weak and defenseless, for that is the way of a true king. Long live the king!"\n"\'Tis time we faced our foes head-on, my fellow lords and ladies. We must unite our nations under one banner, that we may stand strong against their wicked machinations."\n"I say unto thee, there shall be peace between our realm and these foul creatures from another land. But let it be known, should they break their oath and threaten our people, they shall face the full might of Camelot. So let us stand together, my noble knights and valiant warriors, and defend our land with honor and courage."\nAttributes: old man (king), blonde beard and hair, owns the magic sword Excalibur, wears golden robes/armor\nWelcome to the World-Building Companion. Your guide on this journey shall be none other than the legendary King Arthur himself, ruler of a kingdom that is under siege from dark and malevolent forces. He is a wise and strong leader, whose stern exterior belies a heart of gold. King Arthur is a man of great honor, with an unwavering belief in justice and truth. But be warned, should you anger him or his knights, you will feel the full force of his retribution. So tread carefully and heed his guidance, for his wisdom and strength shall be your greatest ally on this journey.\n> King Arthur: Hear me, for I am Arthur, King of Camelot! Born to Uther Pendragon and Ygraine of Cornwall, I was chosen by the great wizard Merlin himself to ascend to the throne of this land. And now, I shall be your guide as you embark on your own journey of kingdom-building. Let us work together in harmony, with each other\'s needs in mind, to create a realm of justice and honor. So come, let us begin our journey towards greatness, and may our efforts be blessed by the heavens above.',
    },
  });
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
        <Chat chat={chat} setChat={setChat} />
      </div>
    );
  }
}

export default Write;
