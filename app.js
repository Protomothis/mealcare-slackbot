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

// region initialize
commandServices(app);
// endregion

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Mealcare-bot ${API_VERSION} is running on port ${port}!`);
})();
