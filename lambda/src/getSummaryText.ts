import { Scoreboard, WEEK_STATUS } from "./types";
const squiglies = "~~~~~~~~~~~~~~~~~~~~~~~~~~~";

const getSummaryText = (weekNum: number, summary: Scoreboard[], status: WEEK_STATUS) => {
  let summaryText = "";
  summary.forEach((game) => {
    summaryText +=
      status === "JUST FINISHED"
        ? gameTextLastWeek(game)
        : status === "LIVE"
        ? gameTextInProgress(game)
        : gameTextProjections(game);
  });
  const otherText = status === "JUST FINISHED" ? loserOfTheWeekText(summary) : "";
  return `${squiglies}\n${titleText(weekNum, status)}\n${squiglies}${summaryText}${otherText}`;
};

const gameTextProjections = (game: Scoreboard) => {
  const { homeName, homeScore, awayName, awayScore } = game;
  const home = `${homeName} (${homeScore.toFixed(1)})`;
  const away = `${awayName} (${awayScore.toFixed(1)})`;
  return `\n${away}\n${getProjectedVsText(game)}\n${home}\n`;
  //   return `\n${awayLastName} ${getProjectedVsText(game)} ${homeLastName} ${score}\n${squiglies}`;
};

const gameTextInProgress = (game: Scoreboard) => {
  const { homeName, homeScore, awayName, awayScore } = game;
  const home = `${homeName} (${homeScore.toFixed(1)})`;
  const away = `${awayName} (${awayScore.toFixed(1)})`;
  let winningTeam = homeScore > awayScore ? home : away;
  let losingTeam = homeScore > awayScore ? away : home;
  return `\n${winningTeam}\n${getInProgressVsText(game)}\n${losingTeam}\n`;
};

const gameTextLastWeek = (game: Scoreboard) => {
  const { homeLastName, homeScore, awayLastName, awayScore } = game;
  const score = `${awayScore.toFixed(1)}-${homeScore.toFixed(1)}`;
  return `\n${awayLastName} ${getLastWeekVsText(game)} ${homeLastName} ${score}\n`;
};

const titleText = (weekNum: number, status: WEEK_STATUS) => {
  switch (status) {
    case "LIVE":
      return `~~~~ Week ${weekNum} score update ~~~~`;
    case "UPCOMING":
      return `~~~~~ Week ${weekNum} Projections ~~~~~`;
    case "JUST FINISHED":
      return `~~~~~ Week ${weekNum} Summary ~~~~~`;
    default:
      return "";
  }
};

const getProjectedVsText = (game: Scoreboard) => {
  let diff = game.awayScore - game.homeScore;
  switch (true) {
    case Math.abs(diff) < 3:
      return "has a close one against";
    case diff < -25:
      return "is not looking good against";
    case diff < -11:
      return "will probably lose to";
    case diff < 0:
      return "is projected to lose to";
    case diff > 25:
      return "is going to curb stomp";
    case diff > 11:
      return "will probably beat";
    case diff > 0:
      return "is expected to beat";
  }
  return "vs.";
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
const getLastWeekVsText = (game: Scoreboard) => {
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

const loserOfTheWeekText = (summary: Scoreboard[]) => {
  let personName,
    teamName = "";
  let points = 200;
  summary.forEach((game) => {
    if (game.awayScore > game.homeScore && game.homeScore < points) {
      personName = game.homeFirstName + " " + game.homeLastName;
      teamName = game.homeName;
      points = game.homeScore;
    } else if (game.homeScore > game.awayScore && game.awayScore < points) {
      personName = game.awayFirstName + " " + game.awayLastName;
      teamName = game.awayName;
      points = game.awayScore;
    }
  });
  return `\nAnd the BIG DUMB IDIOT OF THE WEEK is ${personName}, who only scored ${points} points`;
};
export default getSummaryText;
