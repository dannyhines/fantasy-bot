const fetch = require("node-fetch");
const sendGroupmeMsg = async (text: string) => {
  const URL = "https://api.groupme.com/v3/bots/post";
  try {
    const body = { bot_id: process.env.GM_BOT_ID, text: text };

    const response = await fetch(URL, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    console.log("Message sent w/ status code", response.status);
  } catch (err) {
    throw Error("(in sendGroupmeMsg()):" + err);
  }
};

export default sendGroupmeMsg;
