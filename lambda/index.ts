require("dotenv").config();
const fetch = require("node-fetch");
import { Client } from "espn-fantasy-football-api/node";

const leagueId = 71381786;
const fantasyClient = new Client({ leagueId });
const squiglies = "~~~~~~~~~~~~~~~~~~~~~~~~~~~";

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const { seasonId, scoringPeriodId } = await getCurrentWeek();
    // console.log("Current week: ", scoringPeriodId);

    const summary: Matchup[] = await getBoxscoreSummary(seasonId, scoringPeriodId);
    const summaryText = getSummaryText(scoringPeriodId, summary);
    await sendGroupmeMsg(summaryText);

    return { statusCode: 200, body: "It worked!" };
  } catch (err) {
    console.log("ERROR:", err);
    return { statusCode: 500, body: "Server Error. Check the logs" };
  }
};

interface Boxscore {
  homeScore: number;
  homeTeamId: number;
  awayScore: number;
  awayTeamId: number;
}
interface Team {
  id: number;
  name: string;
  // logoURL: string
}

interface Matchup {
  homeScore: number;
  awayScore: number;
  homeName: string;
  awayName: string;
}

const sendGroupmeMsg = async (text: string) => {
  const URL = "https://api.groupme.com/v3/bots/post";
  try {
    const body = { bot_id: process.env.GM_BOT_ID, text: text };
    const response = await fetch(URL, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    console.log("Message sent w/ status code ", response.status);
  } catch (err) {
    throw Error("(in sendGroupmeMsg()):" + err);
  }
};

// Returns the current year (seasonId) and week (scoring period)
const getCurrentWeek = async () => {
  const URL = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/71381786";
  try {
    const response = await fetch(URL);
    const { seasonId, scoringPeriodId } = await response.json();
    return { seasonId, scoringPeriodId };
  } catch (err) {
    throw Error("(in getCurrentWeek()):" + err);
  }
};

// Calls ESPN API and formats game data
const getBoxscoreSummary = async (seasonId: number, scoringPeriodId: number) => {
  try {
    const boxscores: Boxscore[] = await fantasyClient.getBoxscoreForWeek({
      seasonId,
      matchupPeriodId: scoringPeriodId,
      scoringPeriodId,
    });
    const teams: Team[] = await fantasyClient.getTeamsAtWeek({
      seasonId,
      matchupPeriodId: scoringPeriodId,
      scoringPeriodId,
    });
    return boxscores.map((score: Boxscore) => {
      return {
        homeScore: score.homeScore,
        awayScore: score.awayScore,
        homeName: teams.find((x) => x.id === score.homeTeamId)?.name || "Home",
        awayName: teams.find((x) => x.id === score.awayTeamId)?.name || "Away",
      };
    });
  } catch (err) {
    throw Error("(in getBoxscoreSummary()):" + err);
  }
};

const getSummaryText = (weekNum: number, summary: Matchup[]) => {
  let summaryText = "";
  summary.forEach((game) => {
    summaryText += `
${game.awayName} (${game.awayScore})
${getVsText(game)}
${game.homeName} (${game.homeScore})
${squiglies}`;
  });
  return `${squiglies}\n~~~~ Week ${weekNum} score update ~~~~\n${squiglies}${summaryText}`;
};

const getVsText = (game: Matchup) => {
  let diff = game.awayScore - game.homeScore;
  // > 0 = winning
  switch (true) {
    case Math.abs(diff) < 3:
      return "is basically tied with";
    case diff < -25:
      return "is getting destroyed by";
    case diff < 0:
      return "is losing to";
    case diff > 25:
      return "is kicking the shit out of";
    case diff > 0:
      return "is beating";
  }
  return "vs.";
};
// import { BoxscoreResponse } from "./types";
//
// const getBoxscoresManually = async () => {
//   const BASE_URL = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/";
//   const scoresUrl = BASE_URL + "segments/0/leagues/71381786?view=mMatchupScore&view=mTeam";

//   try {
//     const response = await fetch(scoresUrl);
//     const data: BoxscoreResponse = await response.json();

//     if (data.scoringPeriodId > data.status.finalScoringPeriod) {
//       return { statusCode: 200, body: "The season is over :(" };
//     }

//     const teamNames = data.teams.map((x) => x.location + " " + x.nickname).join(", ");
//   } catch (err) {
//     throw Error("(in getBoxscoresManually()):" + err);
//   }
// }
