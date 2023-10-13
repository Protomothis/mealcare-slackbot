const { App } = require("@slack/bolt");
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

const commandServices = require('./services/command.service');
const { API_VERSION } = require('./utils/const');

require("dotenv").config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: Boolean(process.env.SOCKET_MODE),
  appToken: process.env.APP_TOKEN,
});
app.command("/menu", async ({ command, ack, say }) => {
  try {
    await ack();
    const { storeName, cornerName, mainMenu, subMenus } = await getTodayMenu();
    if (!storeName || !cornerName || !mainMenu || !subMenus) {
      throw Error('오늘은 식당 휴업일이거나 메뉴 정보가 없습니다.');
    }
    say(`[${getTodayString()}] 오늘의 ${storeName}의 ${cornerName} 메뉴는 ${mainMenu}와 ${subMenus?.join(', ')}`);
  } catch (error) {
    console.error(error);
    say(`${error}`);
  }
});

// region initialize
commandServices(app);
// endregion

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Mealcare-bot ${API_VERSION} is running on port ${port}!`);
})();
