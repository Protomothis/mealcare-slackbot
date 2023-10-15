import { convertArrayToCsv, getTodayString, getWeekdaysInCurrentWeek } from '../utils';
import { fetchOurhomeApiKey, fetchOurhomeMainMenu, fetchOurhomeSubMenu } from '../api';
import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { Mealcare } from '../models';
import dayjs from 'dayjs';

const commandServices = (app: App<StringIndexed>) => {
  const getMenuByReferenceDate = async (referenceDate: string = getTodayString()): Promise<Mealcare.ServiceMenu> => {
    try {
      const apiKey = await fetchOurhomeApiKey();
      const [mainSupply, subList] = await Promise.all([fetchOurhomeMainMenu(apiKey, referenceDate), fetchOurhomeSubMenu(apiKey, referenceDate)]);
      const storeName = mainSupply.BUSIPLNM;
      const cornerName = mainSupply.CORNERNM;
      const mainMenu = mainSupply.MENUNM;
      const subMenus = subList.map((list) => list.MENUNM).filter(Boolean);
      return { storeName, cornerName, mainMenu, subMenus };
    } catch (err) {
      return err;
    }
  }

  app.command('/menu', async ({ command, ack, say }) => {
    try {
      await ack();
      const { storeName, cornerName, mainMenu, subMenus } = await getMenuByReferenceDate();
      if (!storeName || !cornerName || !mainMenu || !subMenus) {
        throw Error('오늘은 식당 휴업일이거나 메뉴 정보가 없습니다.');
      }
      await say(`[${getTodayString()}] 오늘의 ${storeName}의 ${cornerName} 메뉴는 ${mainMenu}와 ${subMenus?.join(', ')}`);
    } catch (error) {
      console.error(error);
      await say(`${error}`);
    }
  });

  app.command('/menu-week', async ({ command, ack, say}) => {
    try {
      await ack();
      const weekMenus = await Promise.all(getWeekdaysInCurrentWeek().map(async (date: string) => {
        const { mainMenu, subMenus} = await getMenuByReferenceDate(date);
        return [`${date} (${dayjs(date).format('dddd')})`, mainMenu, ...subMenus].filter(Boolean);
      }));
      await app.client.files.uploadV2({
        token: process.env.SLACK_BOT_TOKEN,
        channel_id: command.channel_id,
        file: convertArrayToCsv(weekMenus),
        title: 'CSV File',
        filename: 'menu.csv',
        initial_comment: '이번 주 식단표를 확인하세요.'
      });
    } catch (error) {
      console.error(error);
      await say(`${error}`);
    }
  });
};

export default commandServices;
