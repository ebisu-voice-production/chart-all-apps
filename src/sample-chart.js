import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const data = [
  { name: 'A', uv: 900, pv: 2400 },
  { name: 'B', uv: 300, pv: 4567 },
  { name: 'C', uv: 280, pv: 1398 },
  { name: 'D', uv: 200, pv: 9800 },
  { name: 'E', uv: 278, pv: 4000 },
  { name: 'F', uv: 189, pv: 3800 },
  { name: 'G', uv: 189, pv: 2800 },
  { name: 'H', uv: 889, pv: 1800 },
  { name: 'I', uv: 189, pv: 4800 },
  { name: 'J', uv: 489, pv: 8800 },
];
const Sample = () => (
  <LineChart width={500} height={300} data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
  </LineChart>
);

const rendered = ReactDOMServer.renderToString(<Sample />);
const chart = rendered.match(/<svg.+<\/svg>/)[0];

console.log(chart);
