import { useState, useEffect } from "react";
import React from "react";
import styles from "../../../Styles/Template.module.css";
import {
  AiFillDelete,
  AiFillPlusSquare,
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai";
import {
  BsFillArrowUpSquareFill,
  BsFillArrowDownSquareFill,
} from "react-icons/bs";

function Template({ formData, setTemplateData }) {
  const [data, setData] = useState(formData);
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    setData(formData);
  }, [formData]);
  useEffect(() => {
    setTemplateData(data);
  }, [data]);
  const addData = () => {
    setData([...data, { id: Date.now(), type: "info", label: "", value: "" }]);
  };
  const toggleContent = () => {
    setShowContent(!showContent);
  };
  const deleteData = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const updateData = (id, updatedValue) => {
    const newData = data.map((item) => (item.id === id ? updatedValue : item));
    setData(newData);
  };

  const moveData = (index, direction) => {
    const newData = [...data];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= newData.length) return;

    [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
    setData(newData);
  };

  return (
    <>
      <h1 className={styles.title} onClick={toggleContent}>
        Infobox {showContent ? <AiFillCaretDown /> : <AiFillCaretUp />}
      </h1>

      {showContent && (
        <>
          <div className={styles["form-data-container"]}>
            {data.map((item, index) => (
              <div key={item.id} className={styles["form-data-item"]}>
                <select
                  value={item.type}
                  onChange={(e) =>
                    updateData(item.id, { ...item, type: e.target.value })
                  }
                >
                  <option value="info">Info</option>
                  <option value="header">Header</option>
                  <option value="image">Image</option>
                  <option value="expanded">Expanded</option>
                </select>
                {(item.type === "info" || item.type === "expanded") && (
                  <>
                    <input
                      type="text"
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) =>
                        updateData(item.id, { ...item, label: e.target.value })
                      }
                    />
                    {item.type === "info" ? (
                      <input
                        type="text"
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) =>
                          updateData(item.id, {
                            ...item,
                            value: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <textarea
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) =>
                          updateData(item.id, {
                            ...item,
                            value: e.target.value,
                          })
                        }
                      />
                    )}
                  </>
                )}
                {item.type === "header" && (
                  <input
                    type="text"
                    placeholder="Header"
                    value={item.value}
                    onChange={(e) =>
                      updateData(item.id, { ...item, value: e.target.value })
                    }
                  />
                )}
                {item.type === "image" && (
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={item.value}
                    onChange={(e) =>
                      updateData(item.id, { ...item, value: e.target.value })
                    }
                  />
                )}
                <button
                  className={styles["action-buttons"]}
                  onClick={() => moveData(index, -1)}
                >
                  <BsFillArrowUpSquareFill />
                </button>
                <button
                  className={styles["action-buttons"]}
                  onClick={() => moveData(index, 1)}
                >
                  <BsFillArrowDownSquareFill />
                </button>
                <button
                  className={styles["action-buttonsDelete"]}
                  onClick={() => deleteData(item.id)}
                >
                  <AiFillDelete />
                </button>
              </div>
            ))}
            <div className={styles["action-buttons"]} onClick={addData}>
              <button className={styles["action-buttons-add"]}>
                <AiFillPlusSquare />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default Template;
