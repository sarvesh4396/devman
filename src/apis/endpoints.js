// Endpoints

const endpoints = {
  symbl: { name: "url", name1: "url" },
  codex: { name: "url", name1: "url" },
  datamuse: { synonym: "https://api.datamuse.com/words?ml=" },
};

module.exports = {
  datamuse: endpoints.datamuse,
  symbl: endpoints.symbl,
  codex: endpoints.codex,
};
