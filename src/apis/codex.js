// CODOEX Ai implementation

const { codex } = require("./endpoints");
const vscode = require("vscode");
const {
  is_codex_apikey,
  show_settings_popup,
  read_settings,
  get_tab_config,
  postRequest,
  getSelectedText,
  get_language_id,
  replaceText,
  set_cursor_at_last_line,
  getInsertPosition,
  set_python_position,
} = require("../utils/util");
const languages_data = require("../utils/lang");

const HEADERS = {
  Authorization: "Bearer " + read_settings().openAI.key || "",
};

function set_codex_key() {
  show_settings_popup("Set your OpenAi API Key.");
}

function get_examples(language) {
  if (!language) {
    return "";
  }

  const examples = languages_data.languages[language];
  const stop_tokens = languages_data.stop_tokens[language];
  const start_tokens = languages_data.start_tokens[language];
  let data = "";

  for (let ex of examples) {
    data +=
      ex.code +
      "\n" +
      start_tokens +
      "\n" +
      ex.docs +
      "\n" +
      stop_tokens +
      "\n";
  }

  return data;
}
async function algo_to_code() {
  if (!is_codex_apikey()) {
    set_codex_key();
  } else {
    const text = getSelectedText();
    if (text) {
      const lang_id = get_language_id();
      console.log(lang_id, "\n", text);
      if (lang_id) {
        let prompt_text = text;
        const body = {
          prompt: prompt_text,
          temperature: 0,
          max_tokens: text.length * 5,
          top_p: 1,
          echo: false,
          frequency_penalty: 0,
          presence_penalty: 0,
        };
        try {
          const response = await postRequest(codex.completion, body, HEADERS);
          console.log(response.data);
          const code = "\n" + response.data.choices[0].text + "\n";
          set_cursor_at_last_line();
          replaceText(code);
          vscode.window.showInformationMessage("COMPLETED");
        } catch (error) {
          console.log(error);
          vscode.window.showErrorMessage(error);
        }
      }
    }
  }
}

async function code_to_algo() {
  if (!is_codex_apikey()) {
    set_codex_key();
  } else {
    const text = getSelectedText();
    if (text) {
      const lang_id = get_language_id();
      if (lang_id) {
        const start_token = languages_data.stop_tokens[lang_id];
        const stop_token = languages_data.start_tokens[lang_id];
        let prompt_text =
          text + "\n" + languages_data.code_to_algo_str[lang_id] + stop_token;
        const body = {
          prompt: prompt_text,
          temperature: read_settings().openAI.temperature || 0.8,
          max_tokens: text.length * 4,
          top_p: 1,
          n: 1,
          echo: false,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: stop_token,
        };
        try {
          const response = await postRequest(codex.completion, body, HEADERS);
          const code =
            start_token +
            "\n" +
            response.data.choices[0].text +
            "\n" +
            stop_token;
          console.log(response);
          set_cursor_at_last_line();
          replaceText(code);
        } catch (error) {
          console.log(error);
          vscode.window.showErrorMessage(error);
        }
      }
    }
  }
}

async function generate_docs() {
  if (!is_codex_apikey()) {
    set_codex_key();
  } else {
    const text = getSelectedText();
    if (text) {
      const lang_id = get_language_id();
      if (lang_id) {
        const stop_token = languages_data.stop_tokens[lang_id];
        const start_token = languages_data.start_tokens[lang_id];

        let prompt_text =
          get_examples(get_language_id()) +
          "\n" +
          text +
          "\n" +
          languages_data.generating_str[lang_id];
        const body = {
          prompt: prompt_text,
          temperature: read_settings().openAI.temperature || 0.9,
          max_tokens: 100,
          top_p: 1,
          n: 1,
          stream: false,
          logprobs: null,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: stop_token,
        };
        try {
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: "Generating docstring",
              cancellable: true,
            },
            () => {
              return new Promise(async (resolve) => {
                const editor = vscode.window.activeTextEditor;
                {
                  const insertPosition = getInsertPosition(
                    vscode.window.activeTextEditor
                  );
                  const response = await postRequest(
                    codex.completion,
                    body,
                    HEADERS
                  );
                  const docs =
                    start_token +
                    response.data.choices[0].text +
                    "\n" +
                    stop_token;

                  const tab_config = get_tab_config();
                  const indentation = " ".repeat(Number(tab_config.tabSize));

                  try {
                    if (lang_id == "python") {
                      set_python_position();
                      const fin_docs =
                        "\n" +
                        indentation +
                        docs.replace(/\n/g, "\n" + indentation);
                      replaceText(fin_docs);
                    } else {
                      const snippet = new vscode.SnippetString(`${docs}\n`);

                      editor.insertSnippet(snippet, insertPosition);
                    }
                    resolve("Complete docstring generation");
                  } catch (e) {
                    vscode.window.showErrorMessage(e);
                    resolve(e);
                  }
                }
              });
            }
          );

          // set_cursor_at_last_line();
          // replaceText(docs);
        } catch (error) {
          console.log(error);
          vscode.window.showErrorMessage(error);
        }
      }
    }
  }
}

module.exports = { algo_to_code, code_to_algo, generate_docs };
