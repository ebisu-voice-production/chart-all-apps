import request from 'request-promise-native';
import moment from 'moment';
import fs from 'fs';

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
  data.forEach(({ author: tmp, devices = [] }) => {
    const author = tmp || 'unknowns';
    const hasGoogleHome = devices.find(device => device === 'Google Home');
    if (hasGoogleHome || devices.length === 0) { // old data does not have 'devices' property
      counts[author] = (counts[author] || 0) + 1;
    }
  });
  return counts;
};

export default async () => {
  const cacheJson = fs.readFileSync('./outputs/cache.json');
  const cache = cacheJson && JSON.parse(cacheJson);
  const filteredCache = (cache && cache.filter(d => d)) || [];
  const latestDate = filteredCache.length > 0 && filteredCache[filteredCache.length - 1].__date;
  const startDate = latestDate || '2018-01-11';
  const totalDays = moment().diff(startDate, 'day');
  const initList = Array.from(Array(totalDays).keys()).map(day => ({
    date: moment(startDate).add(day + 1, 'day').format('YYYY-MM-DD'),
  }));
  let authors = [];
  const list = await Promise.all(initList.map(async item => {
    const result = await fetch(item.date);
    if (result) {
      const countedAuthors = countAuthors(result);
      authors = [...authors, ...Object.keys(countedAuthors)].filter((m, i, a) => a.indexOf(m) === i);
      const { date } = item;
      return {
        __date: date,
        date: moment(date).format('MM/DD'),
        ...countedAuthors,
      };
    }
    return null;
  }));

  const filtered = list.filter(i => i);
  const mergeList = [...filteredCache, ...filtered];
  // cache
  fs.writeFileSync('./outputs/cache.json', JSON.stringify(mergeList, null, 2));

  const reduced = mergeList.map(({ __date, ...main }) => main).reduce((a, b, i) => {
    if (i % 7 === 0 || filtered.length === i + 1) {
      return [...a, b];
    }
    return a;
  }, []);
  return {
    data: reduced,
    authors,
  };
};
