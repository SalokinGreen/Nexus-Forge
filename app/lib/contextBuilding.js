import PileTokenizer from "@/utils/tokenizers/PileTokenizer";
import TokenizerService from "@/utils/tokenizers/gptTokenizer";
import removeMarkdown from "./removeMarkdown";
export default function ContextBuilding(content, memory, extra, type, title) {
  // turn content into an array of strings if it's not empty, and reverse it
  const contentArray = content.length > 0 ? content.split("\n").reverse() : [];
  // turn memory into an array of strings if it's not empty
  const memoryArray = memory.length > 0 ? memory.split("\n").reverse() : [];
  // turn extra into an array of strings if it's not empty
  const extraArray = extra.length > 0 ? extra.split("\n").reverse() : [];
  // context string and token number
  let memoryString = "";
  let context = "";
  let tokens = 0;
  // check how many tokens the title is and add the amount to tokens
  // check if type is krake

  // add memory to context
  memoryArray.forEach((line) => {
    // use PileTokenizer if type is krake
    if (type === "krake") {
      // check of tokens + tokenization of line is less than 1900
      if (tokens + PileTokenizer.encode(line).length < 1900) {
        // add line to start of context
        memoryString = line + "\n" + memoryString;
        // add tokenized line length to tokens
        tokens += PileTokenizer.encode(line).length + 1;
      } else {
        // break out of loop
        return;
      }
    } else {
      // check of tokens + tokenization of line is less than 1900
      if (tokens + TokenizerService.encode(line).length < 1900) {
        // add line to start of memoryString
        memoryString = line + "\n" + memoryString;
        // add tokenized line length to tokens
        tokens += TokenizerService.encode(line).length + 1;
      } else {
        // break out of loop
        return;
      }
    }
  });
  // add extra to context
  extraArray.forEach((line) => {
    // use PileTokenizer if type is krake
    if (type === "krake") {
      // check of tokens + tokenization of line is less than 1900
      if (tokens + PileTokenizer.encode(line).length < 1900) {
        // add line to start of context
        context = line + "\n" + context;
        // add tokenized line length to tokens
        tokens += PileTokenizer.encode(line).length + 1;
      } else {
        // break out of loop
        return;
      }
    } else {
      // check of tokens + tokenization of line is less than 1900
      if (tokens + TokenizerService.encode(line).length < 1900) {
        // add line to start of context
        context = line + "\n" + context;
        // add tokenized line length to tokens
        tokens += TokenizerService.encode(line).length + 1;
      } else {
        // break out of loop
        return;
      }
    }
  });
  // add content to context
  contentArray.forEach((line) => {
    // use PileTokenizer if type is krake
    if (type === "krake") {
      // check of tokens + tokenization of line is less than 1900
      if (tokens + PileTokenizer.encode(line).length < 1900) {
        // add line to start of context
        context = line + "\n" + context;
        // add tokenized line length to tokens
        tokens += PileTokenizer.encode(line).length + 1;
      } else {
        // break out of loop
        return;
      }
    } else {
      // check of tokens + tokenization of line is less than 1900
      if (tokens + TokenizerService.encode(line).length < 1900) {
        // add line to start of context
        context = line + "\n" + context;
        // add tokenized line length to tokens
        tokens += TokenizerService.encode(line).length + 1;
      } else {
        // break out of loop
        return;
      }
    }
  });
  // remove last newline from context
  function removeLastNewLine(str) {
    if (str.endsWith("\n")) {
      return str.slice(0, -1);
    }
    return str;
  }
  // add title to context

  context = memoryString + removeLastNewLine(context);
  // remove markdown from context
  context = removeMarkdown(context);
  // return context
  console.log(context);
  return context;
}
