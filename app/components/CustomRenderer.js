import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useEffect, useState } from "react";
import styles from "../../Styles/custom-renderer.module.css";
export default function CustomRenderer({ children, allArticles }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const router = useRouter();

  const handleKeywordOrTitleClick = (e, keywordOrTitle) => {
    e.preventDefault();
    const matchingArticles = allArticles.filter(
      (article) =>
        article.title.toLowerCase() === keywordOrTitle.toLowerCase() ||
        article.keywords.some(
          (kw) => kw.toLowerCase() === keywordOrTitle.toLowerCase()
        )
    );

    const options = matchingArticles.map((article) => ({
      value: `/article?id=${article.id}`,
      label: article.title,
    }));

    setShowDropdown(true);
    setDropdownOptions(options);
    setDropdownPosition({ top: e.clientY, left: e.clientX });
  };

  const handleDropdownChange = (selectedOption) => {
    setShowDropdown(false);
    router.push(selectedOption.value);
  };

  const processTextNode = (text) => {
    const words = text.split(/([*.,!?:;'"()]+|\b)/);
    return words.map((word, wordIndex) => {
      const matchingArticles = allArticles.filter(
        (article) =>
          article.title.toLowerCase() === word.toLowerCase() ||
          article.keywords.some(
            (keyword) => keyword.toLowerCase() === word.toLowerCase()
          )
      );

      if (matchingArticles.length > 0) {
        return (
          <a
            key={wordIndex}
            href="#"
            onClick={(e) => handleKeywordOrTitleClick(e, word)}
            className={styles.specialword} // Apply the CSS class
          >
            {word}
          </a>
        );
      }
      return <span key={wordIndex}>{word}</span>;
    });
  };

  const processChildNode = (child) => {
    if (typeof child === "string") {
      return processTextNode(child);
    }

    if (child.type === "li") {
      return React.cloneElement(child, {
        children: child.props.children
          .map(processChildNode)
          .reduce((acc, curr) => {
            if (Array.isArray(curr)) {
              return [...acc, ...curr];
            }
            return [...acc, curr];
          }, []),
      });
    }

    try {
      return React.cloneElement(child, {
        children: child.props.children.map(processChildNode),
      });
    } catch (error) {
      return child;
    }
  };

  return (
    <React.Fragment>
      {children.map((child, index) => (
        <React.Fragment key={index}>{processChildNode(child)}</React.Fragment>
      ))}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 999,
          }}
        >
          <Select
            options={dropdownOptions}
            onChange={handleDropdownChange}
            autoFocus
            onBlur={() => setShowDropdown(false)}
            menuIsOpen
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "black",
                color: "white",
                border: "1px solid black",
              }),
              option: (provided) => ({
                ...provided,
                backgroundColor: "black",
                color: "white",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "white",
              }),
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
}
