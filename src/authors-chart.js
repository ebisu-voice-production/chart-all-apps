import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Label } from 'recharts';
import randomcolor from 'randomcolor';
import fs from 'fs';
import dataLoader from './data-loader';

const main = async () => {
  const fetched = await dataLoader();
  const colors = fetched.authors.map(author => randomcolor({ count: 1, seed: author })[0]);
  const latest = fetched.data[fetched.data.length - 1];
  const AuthorsChart = () => (
    <LineChart
      width={1000}
      height={600}
      data={fetched.data}
      margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
    >
      <XAxis dataKey="date" />
      <YAxis>
        <Label value="Released Apps" offset={15} position="top" />
      </YAxis>
      <CartesianGrid stroke="#eee" />
      <Legend
        wrapperStyle={{ position: 'relative' }}
        content={({ payload }) => (
          <ul>
            {payload
              .filter(e => latest[e.value] > 5)
              .sort((a, b) => latest[b.value] - latest[a.value])
              .map((e, index) => (
                <li key={`item-${index}`} style={{ color: e.color }}>
                  {e.value}({latest[e.value]})
                </li>
              ))}
            <li style={{ color: 'gray' }}>and more...</li>
          </ul>
        )}
      />
      {fetched.authors.map((author, i) => (
        <Line name={author} type="monotone" dataKey={author} stroke={colors[i]} />
      ))}
    </LineChart>
  );

  const rendered = ReactDOMServer.renderToString(<AuthorsChart />);
  const html = content => `<html><head><meta charset="utf-8"></head><body>${content}</body></html>`;
  fs.writeFileSync('./outputs/authors-chart.html', html(rendered));
};

main();
