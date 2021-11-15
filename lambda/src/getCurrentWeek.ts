const fetch = require("node-fetch");
const leagueId = process.env.FF_LEAGUE_ID;

// Returns the current year (seasonId) and week (scoring period)
const getCurrentWeek = async () => {
  const URL = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/${leagueId}?view=mNav`;
  try {
    const response = await fetch(URL);
    const { seasonId, scoringPeriodId, status } = await response.json();
    return { seasonId, currentWeek: scoringPeriodId, finalWeek: status.finalScoringPeriod };
  } catch (err) {
    throw Error("(in getCurrentWeek()):" + err);
  }
};
export default getCurrentWeek;
