import { Player, Scoreboard } from "./types";

export const playersProjectedZero = (boxscore: Scoreboard[]) => {
  let list: PeoplePlayers[] = [];
  for (let i = 0; i < boxscore.length; i++) {
    let playersAway = [];
    let playersHome = [];
    for (let j = 0; j < boxscore[i].awayRoster.length; j++) {
      if (boxscore[i].awayRoster[j].projectedPoints === 0 && boxscore[i].awayRoster[j].starting) {
        playersAway.push(boxscore[i].awayRoster[j]);
      }
    }

    for (let j = 0; j < boxscore[i].homeRoster.length; j++) {
      if (boxscore[i].homeRoster[j].projectedPoints === 0 && boxscore[i].homeRoster[j].starting) {
        playersHome.push(boxscore[i].homeRoster[j]);
      }
    }

    if (playersAway.length > 0) {
      list.push({ lastName: boxscore[i].awayLastName, players: playersAway });
    }
    if (playersHome.length > 0) {
      list.push({ lastName: boxscore[i].homeLastName, players: playersHome });
    }
  }
  return getInjuryReport(list);
};

const getInjuryReport = (list: PeoplePlayers[]) => {
  let text = "";
  let numPeople = 0;
  let numPlayers = 0;
  list.forEach((item: PeoplePlayers) => {
    text += numPeople > 0 ? " and " : "\n";
    text += `${item.lastName} is starting ${item.players.map((x: Player) => x.name).join(" and ")}`;
    numPeople += 1;
    numPlayers += item.players.length;
  });
  if (numPeople > 0) {
    text += ` and ${numPlayers > 1 ? "they're" : "he's"} projected 0 points... set your lineup dude${
      numPeople > 1 ? "s" : ""
    }`;
  }
  return text;
};

interface PeoplePlayers {
  lastName: string;
  players: Player[];
}
