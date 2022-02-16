// Feed implementation
const vscode = require("vscode");
const { get_feed, pick_item, read_settings } = require("../utils/req");

async function pick_article() {
  const feeds = read_settings().feed;
  const picked_feed = await pick_item(
    feeds.map((feed) => ({ label: feed.name, link: feed.link }))
  );
  if (picked_feed) {
    //   console.log(picked_feed);
    const rss_feeds = await get_feed(picked_feed.link);
    //   console.log(rss_feeds);
    const article = await pick_item(rss_feeds);
    //   console.log(article.link);
    return article;
  }
}
async function see_feeds() {
  const article = await pick_article();

  if (article) {
    // @ts-ignore
    vscode.env.openExternal(article.link);
  }
}

module.exports = { see_feeds };
