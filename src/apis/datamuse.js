// datamuse Implementation
const axios = require("axios").default;

const { pick_item, getSelectedText, replaceText } = require("../utils/util");
const { datamuse } = require("./endpoints");

async function get_synonyms() {
  const text = getSelectedText();
  //   console.log(text);
  if (text) {
    const response = await axios.get(
      `${datamuse.synonym}${text.replace(" ", "+")}`
    );
    const data = response.data;
    const picked_item = await pick_item(
      data.map((item) => ({ label: item.word }))
    );
    if (picked_item) {
      //   console.log(picked_item);
      // @ts-ignore
      replaceText(picked_item.label);
    }
  }
}

module.exports = { get_synonyms };
