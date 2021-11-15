// import { Client } from "espn-fantasy-football-api/node";
// const leagueId = process.env.FF_LEAGUE_ID;
// const fantasyClient = new Client({ leagueId });

// // Calls ESPN API Client for teams and scores
// const getBoxscoreSummary = async (seasonId: number, scoringPeriodId: number) => {
//   try {
//     const boxscores: BoxscoreFromApi[] = await fantasyClient.getBoxscoreForWeek({
//       seasonId,
//       matchupPeriodId: scoringPeriodId,
//       scoringPeriodId,
//     });
//     // console.log("boxscores.roster", boxscores.roster)
//     const teams: Team[] = await fantasyClient.getTeamsAtWeek({
//       seasonId,
//       matchupPeriodId: scoringPeriodId,
//       scoringPeriodId,
//     });
//     return boxscores.map((score: BoxscoreFromApi) => {
//       return {
//         homeScore: score.homeScore,
//         awayScore: score.awayScore,
//         homeName: teams.find((x) => x.id === score.homeTeamId)?.name || "Home",
//         awayName: teams.find((x) => x.id === score.awayTeamId)?.name || "Away",
//       };
//     });
//   } catch (err) {
//     throw Error("(in getBoxscoreSummary()):" + err);
//   }
// };

// interface BoxscoreFromApi {
//   homeScore: number;
//   homeTeamId: number;
//   awayScore: number;
//   awayTeamId: number;
// }
// interface Team {
//   id: number;
//   name: string;
//   // logoURL: string
// }
