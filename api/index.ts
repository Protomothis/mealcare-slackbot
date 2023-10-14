import fetch from 'node-fetch';
import { OURHOME_DEFAULT_API_KEY } from '../utils/const';
import { getTodayString } from '../utils';
import jsdom from 'jsdom';
import Ourhome from '../models';

// 아워홈에서 발급하는 api key를 추출합니다.
export const fetchOurhomeApiKey = async () => {
  try {
    return await fetch('https://outerpos.ourhome.co.kr/web/put_test_mobile')
      .then(response => response.text())
      .then(html => {
        const doc = new jsdom.JSDOM(html).window.document;
        return (doc.querySelector('input[name="KEY"]') as HTMLInputElement)?.value;
      });
  } catch (err) {
    console.error('아워홈 API 키 발급 오류', err);
    return OURHOME_DEFAULT_API_KEY;
  }
}

// 오늘의 메인 메뉴를 호출합니다.
export const fetchTodayMainMenu = async (apiKey: string) => {
  try {
    // 대메뉴 불러오기
    const requestBody = new URLSearchParams({
      'KEY': apiKey,
      'GUBUN': 'TODAY_MENU_S5',
      'USER_ID': '',
      'BUSIPLCD': 'FA1WZ',
      'DATE': getTodayString(),
      'LANG': 'KOR',
    } as Record<keyof Ourhome.CommonRequestBody, string>);
    const { result, value } = await fetch('https://fsmobile.ourhome.co.kr/TASystem/MealTicketSub/Mobile/InquireData/OHMI1428R_TODAY_MENU_S5', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: requestBody,
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

// 오늘의 서브 메뉴를 호출합니다.
export const fetchTodaySubMenu = async (apiKey: string) => {
  try {
    // 소메뉴 불러오기
    const requestBody = new URLSearchParams({
      'KEY': apiKey,
      'GUBUN': 'TODAY_SUB_MENU_S2',
      'USER_ID': '',
      'BUSIPLCD': 'FA1WZ',
      'DATE': getTodayString(),
      'LANG': 'KOR',
    } as Record<keyof Ourhome.CommonRequestBody, string>);
    const { result, value } = await fetch('https://fsmobile.ourhome.co.kr/TASystem/MealTicketSub/Mobile/InquireData/OHMI1428R_TODAY_SUB_MENU_S2', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: requestBody,
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
