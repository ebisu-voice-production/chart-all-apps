import request from 'request-promise-native';
import moment from 'moment';

const fetch = async date => {
  try {
    const body = await request(`https://raw.githubusercontent.com/ebisu-voice-production/research-all-apps/master/data/${date}.json`);
    return JSON.parse(body);
  } catch (e) {
    return null;
  }
};

const countAuthors = data => {
  const counts = {};
  data.forEach(({ author }) => {
    counts[author] = (counts[author] || 0) + 1;
  });
  return counts;
};

export default async () => {
  const startDate = '2018-01-11';
  const totalDays = moment().diff(startDate, 'day') + 1;
  const initList = Array.from(Array(totalDays).keys()).map(day => ({
    date: moment(startDate).add(day, 'day').format('YYYY-MM-DD'),
  }));
  let authors = [];
  const list = await Promise.all(initList.map(async item => {
    const result = await fetch(item.date);
    if (result) {
      const countedAuthors = countAuthors(result);
      authors = [...authors, ...Object.keys(countedAuthors).map(a => a || 'unknowns' )].filter((m, i, a) => a.indexOf(m) === i);
      return {
        ...item,
        ...countedAuthors,
      };
    }
    return null;
  }));
  return {
    data: list.filter(i => i),
    authors,
  };
};
