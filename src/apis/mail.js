const { getSelectedText, pick_item, read_settings } = require("../utils/util");
const vscode = require("vscode");
var nodemailer = require("nodemailer");

const options = ["Choose recipients", "Choose List", "Random Email"];
const send_options = ["Send one by one", "Send in one go"];

async function getEmails() {
  const picked_item = await pick_item(options.map((item) => ({ label: item })));
  if (picked_item) {
    const config = read_settings().email;
    let emails = [];
    // @ts-ignore
    if (picked_item.label === options[0]) {
      const picked_item = await pick_item(
        config["to-mails"].map((item) => ({ label: item })),
        true
      );
      if (picked_item.length > 0) {
        for (let i of picked_item) {
          // @ts-ignore
          emails.push(i.label);
        }
      }
      // @ts-ignore
    } else if (picked_item.label === options[1]) {
      const picked_item = await pick_item(
        config["lists"].map((item) => ({
          label: item.name,
          emails: item.emails,
        })),
        true
      );
      if (picked_item.length > 0) {
        for (let list of picked_item) {
          // @ts-ignore
          emails.push(...list.emails);
        }
      }
    } else {
      const raw_string = await vscode.window.showInputBox({
        title: "Email",
        placeHolder: "Enter Emails separated by ,",
      });
      emails.push(...raw_string.split(","));
    }
    return [...new Set(emails)];
  }
}

async function get_mail_options() {
  const emails = await getEmails();
  if (emails.length > 0) {
    const subject = await vscode.window.showInputBox({
      title: "Subject",
      placeHolder: "Enter Subject of Email",
    });
    const body = await vscode.window.showInputBox({
      title: "Body",
      placeHolder: "This snippet is for",
      prompt: "Body of Email before code",
    });
    const config = read_settings().email;
    const picked_item = await pick_item(
      send_options.map((item) => ({ label: item }))
    );
    let all_options = [];
    let options = {
      // @ts-ignore
      from: config.mail,
      to: emails.join(","),
      subject: subject,
      text: body,
    };
    // @ts-ignore
    // Send in one go
    if (picked_item.label == send_options[1]) {
      all_options.push(options);
    } else {
      for (let e of emails) {
        let op = { ...options };
        op.to = e;
        all_options.push(op);
      }
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: config.mail,
        pass: config.pass,
      },
    });
    return { transporter: transporter, mail_options: all_options };
  } else {
    vscode.window.showInformationMessage("No Email Selected");
  }
}
async function sendmail(text) {
  let options = await get_mail_options();
  console.log(options.mail_options);
  // Setting text for mail
  for (let op of options.mail_options) {
    op.text = op.text + "\n\n" + text;
    options.transporter.sendMail(op, function (error, info) {
      if (error) {
        console.log(error);
        vscode.window.showErrorMessage(
          "Tried Every thing? \n Try This https://accounts.google.com/b/0/DisplayUnlockCaptcha"
        );
      } else {
        console.log("Email sent: " + info.response);
        vscode.window.showInformationMessage("Email Sent");
      }
    });
  }
}

function directmail() {
  const text = getSelectedText();
  if (text) {
    sendmail(text);
  }
}

module.exports = { sendmail, directmail };
