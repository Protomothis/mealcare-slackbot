import { App } from '@slack/bolt';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

import commandServices from './services/command.service';
import { API_VERSION } from './utils/const';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

require("dotenv").config();

// Initializes your app with your bot token and signing secret
const app: App<StringIndexed> = new App({
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
