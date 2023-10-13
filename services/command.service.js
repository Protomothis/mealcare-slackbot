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
};

module.exports = commandServices;
