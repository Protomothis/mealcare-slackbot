const dayjs = require('dayjs');

const getTodayString = () => {
  return dayjs().tz().format('YYYYMMDD');
};

module.exports = {
  getTodayString
}
