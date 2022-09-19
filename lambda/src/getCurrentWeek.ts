import { Matchup, Status, WEEK_STATUS } from "./types";
const fetch = require("node-fetch");
const leagueId = process.env.FF_LEAGUE_ID;

// Returns the current year (seasonId) and week (scoring period)
const getCurrentWeek = async () => {
  const year = new Date().getFullYear().toString();
  const URL = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${leagueId}?view=mMatchupScore&view=mScoreboard`;
  try {
    const response = await fetch(URL);
    const data: CurrentWeekResponse = await response.json();
    const status = getStatusForData(data);
    const currentWeek = status === "JUST FINISHED" ? data.scoringPeriodId - 1 : data.scoringPeriodId;
    return { seasonId: data.seasonId, currentWeek, status };
  } catch (err) {
    throw Error("(in getCurrentWeek()):" + err);
  }
};

function getStatusForData(data: CurrentWeekResponse): WEEK_STATUS {
  var today = new Date();
  // on Tuesday => "JUST FINISHED"
  if (today.getDay() === 2) {
    return "JUST FINISHED";
  }
  const { scoringPeriodId, schedule, status } = data;
  const matchup = schedule.filter((x) => x.matchupPeriodId === scoringPeriodId)[0];
  if (new Date())
    if (scoringPeriodId > status.finalScoringPeriod) {
      return "SEASON OVER";
    } else if (!!matchup.home.totalPointsLive && matchup.home.totalPointsLive > 0) {
      return "LIVE";
    }
  return "UPCOMING";
}

interface CurrentWeekResponse {
  seasonId: number;
  scoringPeriodId: number;
  schedule: Matchup[];
  status: Status;
}
export default getCurrentWeek;
