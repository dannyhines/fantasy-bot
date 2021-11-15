import { Scoreboard } from "./types";

const getSummaryText = (weekNum: number, summary: Scoreboard[]) => {
  const squiglies = "~~~~~~~~~~~~~~~~~~~~~~~~~~~";

  let summaryText = "";
  summary.forEach((game) => {
    summaryText += `
  ${game.awayName} (${game.awayScore.toFixed(1)})
  ${getVsText(game)}
  ${game.homeName} (${game.homeScore.toFixed(1)})
  ${squiglies}`;
  });
  return `${squiglies}\n~~~~ Week ${weekNum} score update ~~~~\n${squiglies}${summaryText}`;
};

const getVsText = (game: Scoreboard) => {
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

export default getSummaryText;
