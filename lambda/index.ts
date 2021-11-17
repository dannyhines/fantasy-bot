require("dotenv").config();
import getBoxscores from "./src/getBoxscores";
import getSummaryText from "./src/getSummaryText";
import sendGroupmeMsg from "./src/sendGroupmeMsg";
import getCurrentWeek from "./src/getCurrentWeek";

const TRIGGER_PHRASE = "trigger update";

export const handler = async (event: any = {}): Promise<any> => {
  try {
    console.log("event is 👉", JSON.stringify(event, null, 2));

    // Callback is called, but trigger word isn't mentioned
    if (ignoreCallbackEvent(event)) {
      console.log(`ignoring the message "${JSON.parse(event.body).text}""`);
      return successResponse("Callback succeeded but didn't do anything");
    }

    const { seasonId, currentWeek, status } = await getCurrentWeek();

    if (status === "SEASON OVER") {
      return successResponse("The season is over :(");
    }

    const scores = await getBoxscores(seasonId, currentWeek);
    const summaryText = getSummaryText(currentWeek, scores, status);
    // console.log(summaryText);
    await sendGroupmeMsg(summaryText);

    return successResponse("It worked!");
  } catch (err) {
    console.log("ERROR:", err);
    return { statusCode: 500, body: "Server Error. Check the logs" };
  }
};

const ignoreCallbackEvent = (event: any) => {
  return (
    event &&
    event.path &&
    event.path === "/callback" &&
    event.body &&
    event.headers &&
    event.headers["User-Agent"] &&
    event.headers["User-Agent"].includes("GroupMeBotNotifier") &&
    JSON.parse(event.body).text &&
    !JSON.parse(event.body).text.toLowerCase().includes(TRIGGER_PHRASE)
  );
};

const successResponse = (msg: string) => {
  return { statusCode: 200, body: msg };
};
