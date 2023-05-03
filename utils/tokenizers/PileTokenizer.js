import Tokenizer from "./TokenizerforPile.js";

class PileTokenizer {
  static tokenizers = {};

  static load() {
    return this.getTokenizer(
      process.env.AI_MODEL?.toLowerCase().includes("krake") ? "gpt-2" : "pile"
    );
  }
  static encode(text) {
    const vocab = "pile";
    return this.tokenizers[vocab]?.encode(text);
  }

  static decode(text) {
    const vocab = "pile";
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

PileTokenizer.load();
export default PileTokenizer;
