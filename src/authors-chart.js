import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import fs from 'fs';
import dataLoader from './data-loader';

const main = async () => {
  const fetched = await dataLoader();

  const AuthorsChart = () => (
    <LineChart width={1000} height={600} data={fetched.data}>
      <XAxis dataKey="date" />
      <YAxis />
      <CartesianGrid stroke="#eee" />
      {fetched.authors.map(author => <Line type="monotone" dataKey={author} />)}
    </LineChart>
  );

  const rendered = ReactDOMServer.renderToString(<AuthorsChart />);
  const chart = rendered.match(/<svg.+<\/svg>/)[0];

  fs.writeFileSync('authors-chart.svg', chart);
};

main();
