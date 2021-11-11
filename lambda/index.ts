const fetch = require("node-fetch");
import { BoxscoreResponse } from "./types";

export const handler = async (event: any = {}): Promise<any> => {
  const BASE_URL = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/";
  const scoresUrl = BASE_URL + "segments/0/leagues/71381786?view=mMatchupScore&view=mTeam";

  try {
    const response = await fetch(scoresUrl);
    const data: BoxscoreResponse = await response.json();

    if (data.scoringPeriodId > data.status.finalScoringPeriod) {
      return { statusCode: 200, body: "The season is over :(" };
    }

    const teamNames = data.teams.map((x) => x.location + " " + x.nickname).join(", ");

    await sendGroupmeMsg("The teams are " + teamNames);
    return { statusCode: 200, body: "It worked! the teams are " + teamNames };
  } catch (err) {
    console.log("ERROR:", err);
    return { statusCode: 500, body: "Server Error. Check the logs" };
  }
};

const sendGroupmeMsg = async (text: string) => {
  const URL = "https://api.groupme.com/v3/bots/post";
  try {
    const body = { bot_id: process.env.GM_BOT_ID, text: text };
    const response = await fetch(URL, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log("Message sent. response: ", data);
  } catch (err) {
    throw Error("(in sendGroupmeMsg()):" + err);
  }
};
