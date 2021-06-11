import { Box } from '@material-ui/core';
import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { TopBar } from '../components/TopBar';
import { UserCtx } from '../utils/context';

export function Student() {
  const {
    userInfo: { id },
  } = useContext(UserCtx);

  return (
    <Box>
      <TopBar tabProps={[{ to: '/choose', label: 'Choose' }]} />
      <Switch>
        <Route path="/choose">
          <DataTable
            tableName="choose"
            dataQuery={{
              queryText:
                'select c2.stu_id, c2.cour_id, c.cour_name, c.tea_id, t.tea_name, c2.choose_year,' +
                ' c2.score, c.credit, c.grade, c.cancel_year from public.course c inner join public.teacher ' +
                't on c.tea_id = t.tea_id inner join public.choose c2 on c.cour_id = c2.cour_id inner join ' +
                'public.student s on c2.stu_id = s.stu_id where c2.stu_id = $1',
              values: [id],
            }}
            queryKeys={['stu_id', 'cour_id', 'choose_year']}
            columns={[
              {
                field: 'cour_id',
                headerName: 'Course ID',
                width: 130,
              },
              {
                field: 'cour_name',
                headerName: 'Course Name',
                width: 150,
              },
              {
                field: 'tea_id',
                headerName: 'Teacher ID',
                width: 150,
              },
              { field: 'tea_name', headerName: 'Teacher Name', width: 150 },
              {
                field: 'credit',
                headerName: 'Credit',
                width: 100,
              },
              { field: 'score', headerName: 'Score' },
              {
                field: 'grade',
                headerName: 'Grade',
                width: 100,
              },
              {
                field: 'cancel_year',
                headerName: 'Cancel Year',
                width: 160,
              },
              {
                field: 'choose_year',
                headerName: 'Choose Year',
                width: 150,
              },
            ]}
            allowInsert
          />
        </Route>
        <Route path="/">
          <Redirect to="/choose" />
        </Route>
      </Switch>
    </Box>
  );
}
