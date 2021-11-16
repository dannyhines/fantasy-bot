import { BoxscoreResponse, Matchup, Scoreboard } from "./types";
const fetch = require("node-fetch");
const leagueId = process.env.FF_LEAGUE_ID;

const getBoxscores = async (seasonId: number, scoringPeriodId: number) => {
  const BASE_URL = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/`;
  const scoresUrl = BASE_URL + `segments/0/leagues/${leagueId}?view=mMatchupScore&view=mTeam&view=mScoreboard`;

  try {
    const response = await fetch(scoresUrl);
    const data: BoxscoreResponse = await response.json();

    const boxscores: Scoreboard[] = data.schedule
      .filter((x) => x.matchupPeriodId === scoringPeriodId)
      .map((score: Matchup) => {
        let home = data.teams.find((x) => x.id === score.home.teamId);
        let away = data.teams.find((x) => x.id === score.away.teamId);
        let homeMember = data.members.find((member) => home?.owners.findIndex((owner) => owner === member.id) != -1)!;
        let awayMember = data.members.find((member) => away?.owners.findIndex((owner) => owner === member.id) != -1)!;
        return {
          homeScore: score.home.totalProjectedPointsLive || score.home.totalPoints,
          awayScore: score.away.totalProjectedPointsLive || score.away.totalPoints,
          homeName: home!.location + " " + home!.nickname,
          awayName: away!.location + " " + away!.nickname,
          homeFirstName: homeMember.firstName,
          awayFirstName: awayMember.firstName,
          homeLastName: homeMember.lastName,
          awayLastName: awayMember.lastName,
        };
      });

    return boxscores;
  } catch (err) {
    throw Error("(in getBoxscores()):" + err);
  }
};

export default getBoxscores;
