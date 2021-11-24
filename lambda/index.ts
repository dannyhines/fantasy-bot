require("dotenv").config();
import getBoxscores from "./src/getBoxscores";
import getSummaryText from "./src/getSummaryText";
import sendGroupmeMsg from "./src/sendGroupmeMsg";
import getCurrentWeek from "./src/getCurrentWeek";
import { playersProjectedZero } from "./src/injuryReport";

const UPDATE_PHRASE = "!update";
const INJURY_REPORT_PHRASE = "!injury report";

export const handler = async (event: any = {}): Promise<any> => {
  try {
    console.log("event is 👉", JSON.stringify(event, null, 2));

    const { seasonId, currentWeek, status } = await getCurrentWeek();
    if (status === "SEASON OVER") {
      return successResponse("The season is over :(");
    }

    if (isCallback(event)) {
      console.log(`Callback called for message: "${JSON.parse(event.body).text}"`);
      if (triggeredPhrase(event, UPDATE_PHRASE)) {
        // Continue
      } else if (triggeredPhrase(event, INJURY_REPORT_PHRASE)) {
        return await sendInjuryReport(seasonId, currentWeek);
      } else {
        return successResponse("Callback succeeded but didn't do anything");
      }
    }

    const boxscore = await getBoxscores(seasonId, currentWeek);

    const summaryText = getSummaryText(currentWeek, boxscore, status);
    await sendGroupmeMsg(summaryText);

    return successResponse("It worked!");
  } catch (err) {
    console.log("ERROR:", err);
    return { statusCode: 500, body: "Server Error. Check the logs" };
  }
};

const sendInjuryReport = async (seasonId: number, currentWeek: number) => {
  const boxscore = await getBoxscores(seasonId, currentWeek);
  const report = playersProjectedZero(boxscore);
  if (report != "") {
    await sendGroupmeMsg(report);
    return successResponse("Sent injury report");
  }
  return successResponse("Injury report was blank");
};

function isCallback(event: any): boolean {
  return (
    !!event &&
    !!event.path &&
    event.path === "/callback" &&
    !!event.body &&
    !!event.headers &&
    !!event.headers["User-Agent"] &&
    event.headers["User-Agent"].includes("GroupMeBotNotifier") &&
    !!JSON.parse(event.body).text
  );
}

const triggeredPhrase = (event: any, phrase: string) => {
  return JSON.parse(event.body).text.toLowerCase().includes(phrase);
};

const successResponse = (msg: string) => {
  return { statusCode: 200, body: msg };
};
