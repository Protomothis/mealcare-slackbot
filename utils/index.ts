import dayjs from 'dayjs';
import pp from 'papaparse';
import { COMMON_DATE_FORMAT } from './const';

export const getTodayString = () => {
  return dayjs().tz().format(COMMON_DATE_FORMAT);
};

export const getWeekdaysInCurrentWeek = (referenceDate: string = getTodayString()) => {
  const day = dayjs(referenceDate).tz();
  const startOfWeek = day.startOf('week'); // 현재 주의 시작일 (일요일)
  const endOfWeek = day.endOf('week'); // 현재 주의 종료일 (토요일)
  let currentDate = startOfWeek;

  const weekdays = [];

  while (currentDate.isBefore(endOfWeek)) {
    // 만약 현재 날짜가 토요일 또는 일요일이 아니면 배열에 추가
    if (currentDate.day() !== 0 && currentDate.day() !== 6) {
      weekdays.push(currentDate.format(COMMON_DATE_FORMAT));
    }
    // 다음 날짜로 이동
    currentDate = currentDate.add(1, 'day');
  }

  return weekdays;
}

export const convertArrayToCsv = (array: string[][]): Buffer => {
  const transpose = (matrix: string[][]) => {
    let [row] = matrix;
    return row.map((value, column) => matrix.map(row => row[column]));
  };
  const result = pp.unparse(transpose(array));
  return Buffer.from(result, 'utf-8');
}
