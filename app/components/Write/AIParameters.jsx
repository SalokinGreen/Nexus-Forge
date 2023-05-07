import React, { useState } from "react";
import styles from "../../../Styles/AIParameters.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ListItem = ({ item, removeItem, updateItem }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    updateItem(item, value);
  };

  if (editing) {
    return (
      <div className={styles["list-item editing"]}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={handleSave}>Save</button>
      </div>
    );
  }

  return (
    <div className={styles["list-item"]}>
      <span onClick={handleEdit}>{item}</span>
      <button onClick={() => removeItem(item)}>x</button>
    </div>
  );
};

const AIParameters = () => {
  const [stopSequences, setStopSequences] = useState([]);
  const [newStopSequence, setNewStopSequence] = useState("");
  const [badWords, setBadWords] = useState([]);
  const [newBadWord, setNewBadWord] = useState("");
  const [bias, setBias] = useState([]);
  const [newBias, setNewBias] = useState("");
  const [whitelist, setWhitelist] = useState([]);
  const [newWhitelist, setNewWhitelist] = useState("");
  const [temperature, setTemperature] = useState(1);
  const [outputLength, setOutputLength] = useState(1);
  const [orderItems, setOrderItems] = useState([
    "Tail-Free Sampling",
    "Temperature",
    "Typical Sampling",
    "Top-A",
    "Top-K",
    "Nucleus",
  ]);
  const [showParameters, setShowParameters] = useState(false);
  const [aiModel, setAiModel] = useState("Krake");

  const toggleParameters = () => {
    setShowParameters(!showParameters);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(orderItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setOrderItems(reorderedItems);
  };

  // Add states for the rest of the parameters...

  const addItem = (item, setItem, list, setList) => {
    if (item.trim() === "") return;
    setList([...list, item]);
    setItem("");
  };

  const removeItem = (item, list, setList) => {
    setList(list.filter((x) => x !== item));
  };
  const renderArrayItem = (item, index, array, setArray) => (
    <span key={index} onClick={() => removeArrayItem(index, array, setArray)}>
      {item} ×
    </span>
  );
  const addArrayItem = (item, array, setArray) => {
    if (item) {
      setArray([...array, item]);
    }
  };

  const handleKeyPress = (e, value, array, setArray) => {
    if (e.key === "Enter") {
      addArrayItem(value, array, setArray);
      e.target.value = "";
    }
  };

  const removeArrayItem = (index, array, setArray) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const updateItem = (oldItem, newItem, list, setList) => {
    setList(list.map((x) => (x === oldItem ? newItem : x)));
  };

  return (
    <div className={styles["ai-parameters"]}>
      <h1 onClick={toggleParameters}>Parameters</h1>

      {showParameters && (
        <>
          {/* AI Model Dropdown */}
          <div className="input-group">
            <label>AI Model:</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
            >
              <option value="Krake">Krake</option>
              <option value="Euterpe">Euterpe</option>
              <option value="Sigurd">Sigurd</option>
            </select>
          </div>

          {/* Stop Sequences */}
          <div className={styles["input-group"]}>
            <label>Stop Sequences:</label>
            <div className={styles["list"]}>
              {stopSequences.map((word, index) =>
                renderArrayItem(word, index, stopSequences, setStopSequences)
              )}
            </div>
            <input
              value={newStopSequence}
              onChange={(e) => setNewStopSequence(e.target.value)}
              placeholder="Enter a stop sequence"
              onKeyPress={(e) =>
                handleKeyPress(
                  e,
                  e.target.value,
                  stopSequences,
                  setStopSequences
                )
              }
            />
          </div>

          {/* Bad Words */}
          <div className={styles["input-group"]}>
            <label>Bad Words:</label>
            <div className={styles["list"]}>
              {badWords.map((word, index) =>
                renderArrayItem(word, index, badWords, setBadWords)
              )}
            </div>
            <input
              type="text"
              placeholder="Add bad word"
              onKeyPress={(e) =>
                handleKeyPress(e, e.target.value, badWords, setBadWords)
              }
            />
          </div>

          {/* Bias */}
          <div className={styles["input-group"]}>
            <label>Bias:</label>
            <div className={styles["list"]}>
              {bias.map((word, index) =>
                renderArrayItem(word, index, bias, setBias)
              )}
            </div>
            <input
              type="text"
              placeholder="Add bias"
              onKeyPress={(e) =>
                handleKeyPress(e, e.target.value, bias, setBias)
              }
            />
          </div>

          {/* Temperature */}
          <div className={styles["input-group"]}>
            <label>Temperature:</label>
            <input
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
          </div>

          {/* Output Length */}
          <div className={styles["input-group"]}>
            <label>Output Length:</label>
            <input
              type="number"
              min="1"
              max="200"
              value={outputLength}
              onChange={(e) => setOutputLength(parseInt(e.target.value))}
            />
          </div>

          {/* Order */}
          <div className={styles["input-group"]}>
            <label>Order:</label>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="orderItems">
                {(provided) => (
                  <div
                    className={styles["order-container"]}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {orderItems.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided) => (
                          <div
                            className={styles["order-item"]}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {item}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </>
      )}
    </div>
  );
};

export default AIParameters;
