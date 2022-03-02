const vscode = require("vscode");
const { beautify_share } = require("./apis/carbon");
const { code_to_algo, algo_to_code, generate_docs } = require("./apis/codex");
const { get_synonyms, get_antonyms } = require("./apis/datamuse");
const { see_feeds } = require("./apis/feed");
const { directmail } = require("./apis/mail");
const { get_article_summary } = require("./apis/symbl");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  console.log('Congratulations, "DevMan" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("devman.seeFeed", async function () {
      await see_feeds();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devman.synonym", async function () {
      get_synonyms();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devman.sendmail", async function () {
      directmail();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devman.antonym", async function () {
      get_antonyms();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devman.beautify", async function () {
      beautify_share();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devman.generate_docs", async function () {
      await generate_docs();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devman.algo_to_code", async function () {
      algo_to_code();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("devman.code_to_algo", async function () {
      code_to_algo();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "devman.article_summary",
      async function () {
        get_article_summary();
      }
    )
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
