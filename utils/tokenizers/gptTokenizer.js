import Tokenizer from "./Tokenizer.js";

class TokenizerService {
  static tokenizers = {};

  static load() {
    return this.getTokenizer("gpt-2");
  }
  static encode(text) {
    const vocab = process.env.AI_MODEL?.toLowerCase().includes("krake")
      ? "pile"
      : "gpt-2";
    return this.tokenizers[vocab]?.encode(text);
  }

  static decode(text) {
    const vocab = process.env.AI_MODEL?.toLowerCase().includes("krake")
      ? "pile"
      : "gpt-2";
    return this.tokenizers[vocab]?.decode(text);
  }

  /**
   * @param {string} vocab
   * @return {?Tokenizer}
   */
  static getTokenizer(vocab) {
    if (!vocab)
      throw new Error(
        'You need to specify a vocab file, either "gpt-2" or "pile"'
      );

    if (!this.tokenizers[vocab]) {
      try {
        this.tokenizers[vocab] = new Tokenizer(vocab);
        return this.tokenizers[vocab];
      } catch (e) {
        console.error(e);
      }
    } else {
      return this.tokenizers[vocab];
    }
  }
}

TokenizerService.load();
export default TokenizerService;
