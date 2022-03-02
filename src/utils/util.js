// useful func

const axios = require("axios").default;
const vscode = require("vscode");
const { XMLParser } = require("fast-xml-parser");

async function pick_item(items, choose = false) {
  let pick;
  if (choose) {
    pick = await vscode.window.showQuickPick(items, {
      matchOnDetail: true,
      canPickMany: choose,
    });
  } else {
    pick = await vscode.window.showQuickPick(items, {
      matchOnDetail: true,
    });
  }
  if (pick) {
    return pick;
  } else {
    vscode.window.showInformationMessage("You have not selected any item");
    return;
  }
}
function count_blank_lines(lines) {
  let count = 0;
  if (lines.length <= 1) {
    return count;
  }
  for (let line of lines) {
    if (line.trim() === "") {
      count++;
    }
  }
  return count;
}
function getSelectedText() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const text = editor.document.getText(editor.selection);
    if (text.length > 0) {
      return text;
    } else {
      vscode.window.showInformationMessage("Select some text");
    }
  } else {
    vscode.window.showInformationMessage("Editor does not exist");
    return;
  }
}

function replaceText(to) {
  const editor = vscode.window.activeTextEditor;
  editor.edit((edit) => {
    edit.replace(editor.selection, to);
  });
}
async function get_feed(url) {
  const options = {
    ignoreAttributes: false,
  };

  const parser = new XMLParser(options);
  return axios.get(url).then(function (response) {
    return parser.parse(response.data).rss.channel.item.map((article) => ({
      label: article.title,
      description: article.description.text,
      link: article.link,
    }));
  });
}
function read_settings() {
  return vscode.workspace.getConfiguration("devman");
}
function is_codex_apikey() {
  return read_settings().openAI.key !== null;
}

function show_settings_popup(msg) {
  vscode.window
    .showInformationMessage(msg, "Open Settings")
    .then((selection) => {
      if (selection === "Open Settings") {
        vscode.commands.executeCommand(
          "workbench.action.openSettings",
          "devman"
        );
      }
    });
}

async function postRequest(url, data, headers) {
  return await axios.post(url, data, {
    headers: headers,
  });
}
function get_language_id() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return editor.document.languageId;
  }
  return;
}

function set_cursor_at_last_line() {
  const text = getSelectedText();
  if (text) {
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;
    const lines = text ? text.split("\n") : [""];
    const new_line = Math.max(position.line, lines.length) + 2;
    var newPosition = position.with(new_line, 0);
    editor.selection = new vscode.Selection(newPosition, newPosition);
  }
}
module.exports = {
  set_cursor_at_last_line,
  postRequest,
  pick_item,
  get_feed,
  read_settings,
  replaceText,
  getSelectedText,
  is_codex_apikey,
  show_settings_popup,
  get_language_id,
  count_blank_lines,
};
