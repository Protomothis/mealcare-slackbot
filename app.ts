import { App } from '@slack/bolt';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.tz.setDefault(process.env.TZ || 'Asia/Seoul');

import commandServices from './services/command.service';
import { API_VERSION } from './utils/const';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';

require("dotenv").config();

// Initializes your app with your bot token and signing secret
const app: App<StringIndexed> = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
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
