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
    // console.log("teams: ", teamNames.join(", "));
    return { statusCode: 200, body: "It worked! the teams are " + teamNames };
  } catch (err) {
    console.log("ERROR:", err);
    return { statusCode: 500, body: "It worked" };
  }
};

const sendGroupmeMsg = async (text: string) => {
  // TODO
};
