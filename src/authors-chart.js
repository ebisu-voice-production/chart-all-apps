import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import randomcolor from 'randomcolor';
import fs from 'fs';
import dataLoader from './data-loader';

const main = async () => {
  const fetched = await dataLoader();
  const colors = randomcolor({ count: fetched.authors.length });
  const AuthorsChart = () => (
    <LineChart width={1000} height={600} data={fetched.data}>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid stroke="#eee" />
      {fetched.authors.map((author, i) => <Line type="monotone" dataKey={author} stroke={colors[i]} />)}
    </LineChart>
  );

  const rendered = ReactDOMServer.renderToString(<AuthorsChart />);
  const chart = rendered.match(/<svg.+<\/svg>/)[0];

  fs.writeFileSync('authors-chart.svg', chart);
};

main();
