const { App } = require("@slack/bolt");
const fetch = require("node-fetch");
require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
});
app.command("/menu", async ({ command, ack, say }) => {
  try {
    await ack();
    const { storeName, cornerName, mainMenu, subMenus } = await getTodayMenu();
    say(`오늘의 ${storeName}의 ${cornerName} 메뉴는 ${mainMenu}와 ${subMenus.join(', ')}!`);
  } catch (error) {
    console.log("err")
    console.error(error);
  }
});
// region services
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

const fetchTodayMainMenu = async () => {
  try {
    // 대메뉴 불러오기
    const { result, value } = await fetch('https://fsmobile.ourhome.co.kr/TASystem/MealTicketSub/Mobile/InquireData/OHMI1428R_TODAY_MENU_S5', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
          'KEY': '234696',
          'GUBUN': 'TODAY_MENU_S5',
          'USER_ID': '',
          'BUSIPLCD': 'FA1WZ',
          'DATE': getTodayString(),
          'LANG': 'KOR',
      }),
    }).then((res) => res.json());
    if (result !== 'ok') {
      throw Error('메인 메뉴 데이터를 정상적으로 불러올 수 없습니다.');
    }
    const { Data0 } = JSON.parse(value);
    return Data0.list;
  } catch (err) {
    return err;
  }
};

const fetchTodaySubMenu = async () => {
  try {
    // 대메뉴 불러오기
    const { result, value } = await fetch('https://fsmobile.ourhome.co.kr/TASystem/MealTicketSub/Mobile/InquireData/OHMI1428R_TODAY_SUB_MENU_S2', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
          'KEY': '234696',
          'GUBUN': 'TODAY_SUB_MENU_S2',
          'USER_ID': '',
          'BUSIPLCD': 'FA1WZ',
          'DATE': getTodayString(),
          'LANG': 'KOR',
      }),
    }).then((res) => res.json());
    if (result !== 'ok') {
      throw Error('서브 메뉴 데이터를 정상적으로 불러올 수 없습니다.');
    }
    const { Data0 } = JSON.parse(value);
    return Data0.list;
  } catch (err) {
    return err;
  }
};

const getTodayMenu = async () => {
  try {
    const [[main], subList] = await Promise.all([fetchTodayMainMenu(), fetchTodaySubMenu()]);
    const storeName = main.BUSIPLNM;
    const cornerName = main.CORNERNM;
    const mainMenu = main.MENUNM;
    const subMenus = subList.map((list) => list.MENUNM);
    return { storeName, cornerName, mainMenu, subMenus };
  } catch (err) {
    return err;
  }
}
// endregion

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();