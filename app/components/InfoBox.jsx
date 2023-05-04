import React from "react";
import styles from "./InfoBox.module.css";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CustomRenderer from "./CustomRenderer";
import remarkGfm from "remark-gfm";
const Infobox = ({ data, allArticles }) => (
  <table className={styles.infobox}>
    <tbody>
      {data &&
        data.map((item, index) => (
          <tr key={index}>
            <th className={styles.key}>{item.label}</th>

            <td className={styles.value}>
              <ReactMarkdown
                className={styles.previewContent}
                remarkPlugins={[remarkGfm]}
                components={{
                  p: (props) => (
                    <p>
                      <CustomRenderer {...props} allArticles={allArticles} />
                    </p>
                  ),
                  li: (props) => (
                    <li>
                      <CustomRenderer {...props} allArticles={allArticles} />
                    </li>
                  ),
                }}
              >
                {item.value}
              </ReactMarkdown>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
);

export default Infobox;
