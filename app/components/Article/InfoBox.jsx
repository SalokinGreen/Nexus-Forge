import React, { useState } from "react";
import styles from "../../../Styles/InfoBox.module.css";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CustomRenderer from "../CustomRenderer";
import remarkGfm from "remark-gfm";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
const Infobox = ({ data, allArticles }) => {
  const [expandedItems, setExpandedItems] = useState([]);

  const handleExpandedClick = (index) => {
    setExpandedItems((prevExpandedItems) =>
      prevExpandedItems.includes(index)
        ? prevExpandedItems.filter((item) => item !== index)
        : [...prevExpandedItems, index]
    );
  };

  return (
    <table className={styles.infobox}>
      <tbody>
        {data &&
          data.map((item, index) => (
            <tr key={index}>
              {item.type === "header" ? (
                <th className={styles.key} colSpan="2">
                  {item.value}
                </th>
              ) : (
                <>
                  {item.type !== "image" && (
                    <th className={styles.key}>{item.label}</th>
                  )}
                  <td
                    className={styles.value}
                    colSpan={item.type === "image" ? "2" : "1"}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.value}
                        alt={item.label}
                        className={styles.image}
                      />
                    ) : item.type === "expanded" ? (
                      <div
                        className={`${styles.expanded} ${
                          expandedItems.includes(index) ? styles.open : ""
                        }`}
                        onClick={() => handleExpandedClick(index)}
                      >
                        {expandedItems.includes(index) ? (
                          <AiFillCaretDown />
                        ) : (
                          <AiFillCaretUp />
                        )}
                        <ReactMarkdown>{item.value}</ReactMarkdown>
                      </div>
                    ) : (
                      <ReactMarkdown
                        className={styles.previewContent}
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: (props) => (
                            <p>
                              <CustomRenderer
                                {...props}
                                allArticles={allArticles}
                              />
                            </p>
                          ),
                          li: (props) => (
                            <li>
                              <CustomRenderer
                                {...props}
                                allArticles={allArticles}
                              />
                            </li>
                          ),
                        }}
                      >
                        {item.value}
                      </ReactMarkdown>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Infobox;
