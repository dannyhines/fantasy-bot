import { BoxscoreResponse, Matchup, MatchupObj, Scoreboard } from "./types";
const fetch = require("node-fetch");
const leagueId = process.env.FF_LEAGUE_ID;

const getBoxscores = async (seasonId: number, scoringPeriodId: number) => {
  const BASE_URL = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/`;
  const scoresUrl =
    BASE_URL + `segments/0/leagues/${leagueId}?view=mMatchupScore&view=mTeam&view=mScoreboard&view=mRoster`;

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
          homeRoster: rosterForMatchup(score.home),
          awayRoster: rosterForMatchup(score.away),
        };
      });

    return boxscores;
  } catch (err) {
    throw Error("(in getBoxscores()):" + err);
  }
};

const rosterForMatchup = (matchup: MatchupObj) => {
  if (!matchup.rosterForCurrentScoringPeriod || !matchup.rosterForCurrentScoringPeriod.entries) {
    return [];
  } else {
    return matchup.rosterForCurrentScoringPeriod.entries.map((x) => {
      const slot = x.lineupSlotId;
      return {
        name: x.playerPoolEntry.player.fullName,
        projectedPoints: x.playerPoolEntry.player.stats[0].appliedTotal || -1,
        points: x.playerPoolEntry.appliedStatTotal,
        starting: slot < 9 || slot == 17 || slot == 16,
      };
    });
  }
};
export default getBoxscores;
