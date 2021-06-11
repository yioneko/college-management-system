/* eslint-disable radix */
import { Snackbar, Table, TableCell, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { db } from '../db';

interface OverviewInfo {
  dbName: string;
  studentCnt: number;
  teacherCnt: number;
  classCnt: number;
  chooseCnt: number;
  avgScore: number;
}

async function fetchOverviewInfo(): Promise<OverviewInfo> {
  return {
    dbName: String(
      (await db.query('SELECT current_database()')).rows[0].current_database
    ),
    studentCnt: parseInt(
      (await db.query('SELECT COUNT(*) FROM student')).rows[0].count
    ),
    teacherCnt: parseInt(
      (await db.query('SELECT COUNT(*) FROM teacher')).rows[0].count
    ),
    classCnt: parseInt(
      (await db.query('SELECT COUNT(*) FROM student')).rows[0].count
    ),
    chooseCnt: parseInt(
      (await db.query('SELECT COUNT(*) FROM choose')).rows[0].count
    ),
    avgScore: parseFloat(
      (await db.query('SELECT AVG(score) FROM choose')).rows[0].avg
    ),
  };
}

export function Overview() {
  const [overviewInfo, setOverviewInfo] = useState<OverviewInfo | undefined>();

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    fetchOverviewInfo()
      .then((res) => {
        setOverviewInfo(res);
      })
      .catch(setErrMsg);
  }, []);

  return (
    <Table>
      <TableRow>
        <TableCell>Database Name</TableCell>
        <TableCell>{overviewInfo?.dbName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Student Count</TableCell>
        <TableCell>{overviewInfo?.studentCnt}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Teacher Count</TableCell>
        <TableCell>{overviewInfo?.teacherCnt}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Class Count</TableCell>
        <TableCell>{overviewInfo?.classCnt}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Choose Record Count</TableCell>
        <TableCell>{overviewInfo?.chooseCnt}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Average Score of All students</TableCell>
        <TableCell>{overviewInfo?.avgScore.toFixed(4)}</TableCell>
      </TableRow>
      <Snackbar
        open={!!errMsg}
        message={errMsg}
        onClose={() => {
          setErrMsg('');
        }}
      />
    </Table>
  );
}
