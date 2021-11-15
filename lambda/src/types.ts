// Scoreboard is what's generated after filtering/mapping
export interface Scoreboard {
  homeScore: number;
  awayScore: number;
  homeName: string;
  awayName: string;
}

//  ----- Below here is what's returned from the API --- //

export interface BoxscoreResponse {
  gameId: number;
  id: number;
  schedule: Matchup[];
  scoringPeriodId: number;
  seasonId: number;
  segmentId: number;
  status: Status;
  members: Member[];
  teams: Team[];
}

export interface Matchup {
  away: MatchupObj;
  home: MatchupObj;
  id: number;
  matchupPeriodId: number;
  winner: Winner;
}

export interface MatchupObj {
  teamId: number;
  totalPoints: number;
  totalPointsLive?: number;
  totalProjectedPointsLive?: number;
}

export enum Winner {
  Away = "AWAY",
  Home = "HOME",
  Undecided = "UNDECIDED",
}

export interface Status {
  currentMatchupPeriod: number;
  finalScoringPeriod: number;
  latestScoringPeriod: number;
  // not using these rn
  standingsUpdateDate: number;
  transactionScoringPeriod: number;
  waiverLastExecutionDate: number;
  waiverProcessStatus: { [key: string]: number }; // { [ISO_DATE]: teamId }
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

export interface Team {
  id: number;
  abbrev: string;
  location: string;
  nickname: string;
  primaryOwner: string; // matches Member.id

  record: Record;
  currentProjectedRank: number;
  draftDayProjectedRank: number;
  playoffSeed: number;
  logo: string;
  logoType: LogoType;
  transactionCounter: TransactionCounter;
  waiverRank: number;
}

export enum LogoType {
  CustomValid = "CUSTOM_VALID",
  Vector = "VECTOR",
}

export interface Record {
  away: DivisionClass;
  division: DivisionClass;
  home: DivisionClass;
  overall: DivisionClass;
}

export interface DivisionClass {
  gamesBack: number;
  losses: number;
  percentage: number;
  pointsAgainst: number;
  pointsFor: number;
  streakLength: number;
  streakType: StreakType;
  ties: number;
  wins: number;
}

export enum StreakType {
  Loss = "LOSS",
  Win = "WIN",
}

export interface TransactionCounter {
  acquisitionBudgetSpent: number;
  acquisitions: number;
  drops: number;
  matchupAcquisitionTotals: { [key: string]: number };
  misc: number;
  moveToActive: number;
  moveToIR: number;
  paid: number;
  teamCharges: number;
  trades: number;
}
