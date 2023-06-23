const { getTodayString } = require("../utils");
const { fetchOurhomeApiKey, fetchTodayMainMenu, fetchTodaySubMenu } = require("../api");

const commandServices = (app) => {
  const getTodayMenu = async () => {
    try {
      const apiKey = await fetchOurhomeApiKey();
      const [[main], subList] = await Promise.all([fetchTodayMainMenu(apiKey), fetchTodaySubMenu(apiKey)]);
      const storeName = main.BUSIPLNM;
      const cornerName = main.CORNERNM;
      const mainMenu = main.MENUNM;
      const subMenus = subList.map((list) => list.MENUNM);
      return { storeName, cornerName, mainMenu, subMenus };
    } catch (err) {
      return err;
    }
  }
  
  const getTodayMenuString = async () => {
    const { storeName, cornerName, mainMenu, subMenus } = await getTodayMenu();
    return `[${getTodayString()}] 오늘의 ${storeName}의 ${cornerName} 메뉴는 ${mainMenu}와 ${subMenus.join(', ')} 입니다.`;
  };
  
  app.command("/menu", async ({ command, ack, say }) => {
    try {
      await ack();
      const menuDescription = await getTodayMenuString();
      await say(menuDescription);
      await say('오늘 식사가 마음에 드실까요?');
    } catch (error) {
      console.error(error);
      await say(`다음과 같은 오류가 발생하였습니다. ${error}`);
    }
  });
};

module.exports = commandServices;
