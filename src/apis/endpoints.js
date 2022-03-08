// Endpoints

const { read_settings } = require("../utils/util");

const CODEX_URL = "https://api.openai.com/v1/engines/";
const endpoints = {
  carbon: { carbon: "https://carbon.now.sh/" },
  codex: {
    completion: `${CODEX_URL}${read_settings().openAI.engine}/completions`,
    name1: "url",
  },
  datamuse: {
    synonym: "https://api.datamuse.com/words?ml=",
    antonym: "https://api.datamuse.com/words?rel_ant=",
  },
};

module.exports = {
  datamuse: endpoints.datamuse,
  codex: endpoints.codex,
  carbon: endpoints.carbon,
};
