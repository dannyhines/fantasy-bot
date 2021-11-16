import { Scoreboard, WEEK_STATUS } from "./types";
const squiglies = "~~~~~~~~~~~~~~~~~~~~~~~~~~~";

const getSummaryText = (weekNum: number, summary: Scoreboard[], status: WEEK_STATUS) => {
  let summaryText = "";
  summary.forEach((game) => {
    summaryText += status === "LIVE" ? gameTextInProgress(game) : gameTextLastWeek(game);
  });
  return `${squiglies}\n${titleText(weekNum, status)}\n${squiglies}${summaryText}`;
};

const gameTextInProgress = (game: Scoreboard) => {
  const { homeName, homeScore, awayName, awayScore } = game;
  const home = `${homeName} (${homeScore.toFixed(1)})`;
  const away = `${awayName} (${awayScore.toFixed(1)})`;
  let winningTeam = homeScore > awayScore ? home : away;
  let losingTeam = homeScore > awayScore ? away : home;
  return `\n${winningTeam}\n${getInProgressVsText(game)}\n${losingTeam}\n${squiglies}`;
};

const gameTextLastWeek = (game: Scoreboard) => {
  const { homeLastName, homeScore, awayLastName, awayScore } = game;
  const score = `${awayScore.toFixed(1)}-${homeScore.toFixed(1)}`;
  return `\n${awayLastName} ${getVsText(game)} ${homeLastName} ${score}\n${squiglies}`;
};

// const contentSummary = (summary: Scoreboard[], )
const titleText = (weekNum: number, status: WEEK_STATUS) => {
  switch (status) {
    case "LIVE":
      return `~~~~ Week ${weekNum} score update ~~~~`;
    case "UPCOMING":
      return `~~~ Projections for week ${weekNum} ~~~`;
    case "JUST FINISHED":
      return `~~~~~ Week ${weekNum} Summary ~~~~~`;
    default:
      return "";
  }
};

const getLastWeekVsText = (game: Scoreboard) => {
  let diff = Math.abs(game.awayScore - game.homeScore);
  switch (true) {
    case diff > 25:
      return "kicked the shit out of";
    case diff > 12:
      return "easily beat";
    case diff > 4:
      return "got the win over";
    case diff > 1.5:
      return "narrowly beat";
    case diff > 0:
      return "very narrowly beat";
  }
  return "beat";
};

// Used with winningTeam [vsText] losingTeam
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

// Used with homeTeam [vsText] awayTeam
const getVsText = (game: Scoreboard) => {
  let diff = game.awayScore - game.homeScore;
  switch (true) {
    case diff > 0 && diff < 1.5:
      return "very narrowly beat";
    case diff > 0 && diff < 3:
      return "narrowly beat";
    case diff < 0 && diff > -3:
      return "lost a nailbiter to";
    case diff < -25:
      return "got destroyed by";
    case diff < -11:
      return "lost badly to";
    case diff < 0:
      return "lost to";
    case diff > 25:
      return "kicked the shit out of";
    case diff > 11:
      return "easily beat";
    case diff > 0:
      return "beat";
  }
  return "vs.";
};
export default getSummaryText;
