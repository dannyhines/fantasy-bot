import { Scoreboard } from "./types";

const getSummaryText = (weekNum: number, summary: Scoreboard[]) => {
  const squiglies = "~~~~~~~~~~~~~~~~~~~~~~~~~~~";

  let summaryText = "";
  summary.forEach((game) => {
    const { homeName, homeScore, awayName, awayScore } = game;
    const home = `${homeName} (${homeScore.toFixed(1)})`;
    const away = `${awayName} (${awayScore.toFixed(1)})`;
    let winningTeam = homeScore > awayScore ? home : away;
    let losingTeam = homeScore > awayScore ? away : home;
    summaryText += `\n${winningTeam}\n${getInProgressVsText(game)}\n${losingTeam}\n${squiglies}`;
  });
  return `${squiglies}\n~~~~ Week ${weekNum} score update ~~~~\n${squiglies}${summaryText}`;
};

const getInProgressVsText = (game: Scoreboard) => {
  let diff = Math.abs(game.awayScore - game.homeScore);
  switch (true) {
    case diff > 25:
      return "is kicking the shit out of";
    case diff > 10:
      return "is probably going to beat";
    case diff > 3:
      return "is beating";
    case diff > 0:
      return "is basically tied with";
  }
  return "vs.";
};

// Was being used before I started putting the winner on top
const getVsText = (game: Scoreboard) => {
  let diff = game.awayScore - game.homeScore;
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
export default getSummaryText;
