import React, { useState } from "react";
import styles from "../../../Styles/Chat.module.css";
import axios from "axios";
const Chat = ({ chat, setChat }) => {
  const [selectedAI, setSelectedAI] = useState("masterWong");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(true);
  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageContent, setEditingMessageContent] = useState("");
  const handleAIChange = (key) => {
    setSelectedAI(key);
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const toggleChat = () => {
    setChatExpanded((prevState) => !prevState);
  };
  const handleWriting = (e) => {
    if (editingMessageId) {
      setEditingMessageContent(e.target.value);
    } else {
      setMessage(e.target.value);
    }
  };

  const editMessage = (messageId) => {
    const message = chat[selectedAI].messages.find(
      (msg) => msg.id === messageId
    );

    if (message) {
      setEditingMessageId(messageId);
      setEditingMessageContent(message.content);
    }
  };

  const updateMessage = () => {
    const updatedChat = { ...chat };
    const messageIndex = updatedChat[selectedAI].messages.findIndex(
      (msg) => msg.id === editingMessageId
    );

    if (messageIndex !== -1) {
      updatedChat[selectedAI].messages[messageIndex].content =
        editingMessageContent;
      setChat(updatedChat);
      setEditingMessageId(null);
      setEditingMessageContent("");
    }
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingMessageContent("");
  };

  const deleteMessage = (messageId) => {
    setChat((prevChat) => {
      const updatedChat = { ...prevChat };
      updatedChat[selectedAI].messages = updatedChat[
        selectedAI
      ].messages.filter((message) => message.id !== messageId);
      return updatedChat;
    });
  };
  const sendMessage = () => {
    if (editingMessageId) {
      updateMessage();
    } else {
      // don't add message if message empty = ""
      console.log("message: ", message);
      if (message !== "") {
        setChat((prevChat) => {
          const updatedChat = { ...prevChat };
          updatedChat[selectedAI].messages.push({
            id: Math.random().toString(36).substring(7),
            content: message,
            from: "user",
          });
          handleGenerateResponse();
          return updatedChat;
        });
        setMessage("");
      } else {
        handleGenerateResponse();
      }
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingMessageId === "Update") {
        updateMessage();
      } else {
        sendMessage();
      }
    }
  };
  const handleGenerateResponse = async () => {
    const response = await axios
      .post("/api/chat", {
        chat: chat[selectedAI],
        key: localStorage.getItem("nai_access_key"),
      })
      .catch((err) => console.log(err));
    if (response) {
      console.log("response here:", response.data);
      setChat((prevChat) => {
        const updatedChat = { ...prevChat };
        updatedChat[selectedAI].messages.push({
          id: Math.random().toString(36).substring(7),
          content: response.data,
          from: "AI",
        });
        return updatedChat;
      });
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader} onClick={toggleChat}>
        <img
          src={chat[selectedAI].avatar}
          alt="AI avatar"
          className={styles.aiAvatar}
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown();
          }}
        />
        <span className={styles.aiName}>{chat[selectedAI].name}</span>
      </div>
      {dropdownVisible && (
        <div className={styles.aiDropdown}>
          {Object.keys(chat).map((key) => (
            <div
              key={key}
              className={styles.aiDropdownItem}
              onClick={() => handleAIChange(key)}
            >
              <img
                src={chat[key].avatar}
                alt="AI avatar"
                className={styles.aiDropdownAvatar}
              />
              <span>{chat[key].name}</span>
            </div>
          ))}
        </div>
      )}
      {chatExpanded && (
        <>
          <div className={styles.chatBody}>
            {chat[selectedAI].messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${
                  styles[
                    message.from === "AI"
                      ? "aiMessageWrapper"
                      : "userMessageWrapper"
                  ]
                }`}
              >
                <div
                  className={`${styles.message} ${
                    styles[message.from === "AI" ? "aiMessage" : "userMessage"]
                  }`}
                >
                  {message.content}
                </div>
                <div className={styles.messageButtons}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteMessage(message.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => editMessage(message.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.chatInputContainer}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Type your message..."
              value={editingMessageId ? editingMessageContent : message}
              onChange={handleWriting}
              onKeyPress={handleKeyPress}
            />
            <button
              className={styles.chatSendButton}
              onClick={editingMessageId ? updateMessage : sendMessage}
            >
              {editingMessageId ? "Update" : "Send"}
            </button>
            {editingMessageId && (
              <button
                className={styles.cancelEditingButton}
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
