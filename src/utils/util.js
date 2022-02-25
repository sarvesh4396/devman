// useful func

const axios = require("axios").default;
const vscode = require("vscode");
const { XMLParser } = require("fast-xml-parser");

async function pick_item(items) {
  const pick = await vscode.window.showQuickPick(items, {
    matchOnDetail: true,
  });
  if (pick) {
    return pick;
  } else {
    vscode.window.showInformationMessage("You have not selected any item");
    return;
  }
}

function getSelectedText() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const text = editor.document.getText(editor.selection);
    if (text) {
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
  return {
    apis: {
      symbl: {
        api_key: "",
      },
      codex: {
        api_key: "",
      },
    },
    feed: [
      {
        name: "CSS Tricks",
        link: "https://css-tricks.com/feed/",
      },
      {
        name: "Open-Source",
        link: "https://opensource.com/feed",
      },
    ],
  };
}

module.exports = {
  pick_item,
  get_feed,
  read_settings,
  replaceText,
  getSelectedText,
};
