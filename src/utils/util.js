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
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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
function set_python_position() {
  const text = getSelectedText();
  if (text) {
    const editor = vscode.window.activeTextEditor;
    const position = editor.selection.active;
    const lines = text ? text.split("\n") : [""];
    const delim = ":";
    var line_number = 0;
    var character = 0;
    for (var line of lines) {
      for (let i = 0; i < line.length; i++) {
        if (line[i] === delim) {
          line_number = lines.indexOf(line);
          character = i + 1;
        }
      }
      if (character !== 0) {
        break;
      }
    }
    var newPosition = position.with(
      line_number + editor.selection.start.line,
      character
    );
    editor.selection = new vscode.Selection(newPosition, newPosition);
  }
}

function get_tab_config() {
  const editor = vscode.window.activeTextEditor;
  if (editor)
    return {
      tabSize: editor.options.tabSize,
      insertSpaces: editor.options.insertSpaces,
    };
  return;
}
function getInsertPosition(editor) {
  var firstLine = editor.document.lineAt(editor.selection.start.line);
  const insertPosition = new vscode.Position(
    editor.selection.start.line,
    firstLine.firstNonWhitespaceCharacterIndex
  );
  return insertPosition;
}

function count_empty(text) {
  return (text.match(/(^[ \t]*(\n|$))/gm) || []).length;
}
module.exports = {
  set_cursor_at_last_line,
  postRequest,
  set_python_position,
  pick_item,
  get_feed,
  read_settings,
  replaceText,
  getSelectedText,
  is_codex_apikey,
  show_settings_popup,
  get_language_id,
  count_blank_lines,
  getInsertPosition,
  count_empty,
  get_tab_config,
};
