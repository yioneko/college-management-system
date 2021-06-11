/* eslint-disable no-console */
import { Client } from 'pg';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';

const appPath: string = await ipcRenderer.invoke('get-app-path');

const conf = JSON.parse(
  fs.readFileSync(
    path.join(
      process.env.NODE_ENV === 'production' ? path.dirname(appPath) : __dirname,
      'dbconf.json'
    ),
    {
      encoding: 'utf8',
      flag: 'r',
    }
  )
);

export const db = new Client(conf);
db.connect((err) => {
  if (err) {
    ipcRenderer.send('connect-db-error', err.message);
  }
});
