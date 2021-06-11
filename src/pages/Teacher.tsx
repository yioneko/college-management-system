import { Box } from '@material-ui/core';
import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { TopBar } from '../components/TopBar';
import { UserCtx } from '../utils/context';

export function Teacher() {
  const {
    userInfo: { id },
  } = useContext(UserCtx);

  return (
    <Box>
      <TopBar
        tabProps={[
          { to: '/course', label: 'Course' },
          { to: '/choose', label: 'Choose' },
        ]}
      />
      <Switch>
        <Route path="/course">
          <DataTable
            tableName="course"
            dataQuery={{
              queryText:
                'select c.cour_id, c.cour_name,  c.credit, c.grade, c.cancel_year, ' +
                'ROUND(AVG(c2.score), 2) from public.course c left join public.choose c2 on c.cour_id' +
                ' = c2.cour_id where tea_id = $1 group by c.cour_id, c.cour_name, c.grade, ' +
                'c.cancel_year, c.credit',
              values: [id],
            }}
            queryKeys={['cour_id']}
            columns={[
              { field: 'cour_id', headerName: 'ID' },
              {
                field: 'cour_name',
                headerName: 'Name',
                width: 150,
              },
              {
                field: 'credit',
                headerName: 'Credit',
                editable: true,
                width: 100,
              },
              {
                field: 'grade',
                headerName: 'Grade',
                editable: true,
                width: 100,
              },
              {
                field: 'cancel_year',
                headerName: 'Cancel Year',
                editable: true,
                width: 160,
              },
              {
                field: 'round',
                headerName: 'Average Score',
                width: 170,
              },
            ]}
          />
        </Route>
        <Route path="/choose">
          <DataTable
            tableName="choose"
            dataQuery={{
              queryText:
                'select c2.stu_id, s.stu_name, c.cour_name, c2.cour_id, c2.choose_year, c2.score from ' +
                'public.course c inner join public.choose c2 on c.cour_id = c2.cour_id inner join ' +
                'public.student s on c2.stu_id = s.stu_id  where c.tea_id = $1',
              values: [id],
            }}
            queryKeys={['stu_id', 'cour_id', 'choose_year']}
            columns={[
              {
                field: 'stu_id',
                headerName: 'Student ID',
                width: 130,
              },
              {
                field: 'stu_name',
                headerName: 'Student Name',
                width: 150,
              },
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
              { field: 'score', headerName: 'Score', editable: true },
              {
                field: 'choose_year',
                headerName: 'Choose Year',
                width: 150,
              },
              {
                field: 'round',
                headerName: 'Average Score',
                width: 170,
              },
            ]}
          />
        </Route>
        <Route path="/">
          <Redirect to="/course" />
        </Route>
      </Switch>
    </Box>
  );
}
