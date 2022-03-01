const {
  getSelectedText,
  read_settings,
  show_settings_popup,
  get_language_id,
} = require("../utils/util");
const { carbon } = require("./endpoints");
const vscode = require("vscode");

function beautify_share() {
  const text = getSelectedText();
  if (text) {
    const url = new URL(carbon.carbon);
    const theme = read_settings().carbon;

    if (theme) {
      url.searchParams.set("bg", theme.backgroundColor);
      url.searchParams.set("t", theme.theme);
      url.searchParams.set("wt", theme.windowTheme);
      url.searchParams.set("l", get_language_id());
      url.searchParams.set("ds", theme.dropShadow.toString());
      url.searchParams.set("dsyoff", theme.dropShadowOffsetY);
      url.searchParams.set("dsblur", theme.dropShadowBlurRadius);
      url.searchParams.set("wc", theme.windowControls.toString());
      url.searchParams.set("wa", theme.widthAdjustment.toString());
      url.searchParams.set("pv", theme.paddingVertical);
      url.searchParams.set("ph", theme.paddingHorizontal);
      url.searchParams.set("ln", theme.lineNumbers.toString());
      url.searchParams.set("fl", theme.firstLineNumber.toString());
      url.searchParams.set("fm", theme.fontFamily);
      url.searchParams.set("fs", theme.fontSize);
      url.searchParams.set("lh", theme.lineHeight);
      url.searchParams.set("es", theme.exportSize);
      url.searchParams.set("wm", theme.watermark.toString());
      url.searchParams.set("code", text);
      // @ts-ignore
      vscode.env.openExternal(url.href);
    } else {
      show_settings_popup("Set Theme");
    }
  }
}

module.exports = { beautify_share };
