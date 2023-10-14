import dayjs from 'dayjs';

export const getTodayString = () => {
  return dayjs().tz().format('YYYYMMDD');
};
