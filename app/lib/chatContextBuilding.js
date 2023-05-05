import PileTokenizer from "@/utils/tokenizers/PileTokenizer";
import TokenizerService from "@/utils/tokenizers/gptTokenizer";

export default function ChatContextBuilding(chat, ai) {
  const reverseChat = chat.messages.slice().reverse();
  let context = "";
  let tokens = 0;

  if (ai === "krake-v2") {
    tokens += PileTokenizer.encode(chat.info).length;
  } else {
    tokens += TokenizerService.encode(chat.info).length;
  }
  // add messages to context
  reverseChat.forEach((line) => {
    if (ai === "krake-v2") {
      if (
        tokens +
          PileTokenizer.encode(line.content).length +
          PileTokenizer.encode(
            `> ${line.from === "AI" ? chat.name : "User"}:\n`
          ).length <
        1900
      ) {
        context =
          `> ${line.from === "AI" ? chat.name : "User"}: ${line.content}\n` +
          context;
        tokens += PileTokenizer.encode(line.content).length + 1;
      } else {
        return;
      }
    } else {
      if (
        tokens +
          TokenizerService.encode(line).content.length +
          TokenizerService.encode(
            `> ${line.from === "AI" ? chat.name : "User"}:\n`
          ).length <
        1900
      ) {
        context =
          `> ${line.from === "AI" ? chat.name : "User"}: ${line.content}\n` +
          context;
        tokens += TokenizerService.encode(line).length + 1;
      } else {
        return;
      }
    }
  });
  return chat.info + context + `> ${chat.name}:`;
}
