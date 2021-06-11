import { Box } from '@material-ui/core';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DataTable } from '../components/DataTable';
import { TopBar } from '../components/TopBar';
import { Overview } from './Overview';

export function Admin() {
  return (
    <Box>
      <TopBar
        tabProps={[
          { to: '/student', label: 'Student' },
          { to: '/teacher', label: 'Teacher' },
          { to: '/course', label: 'Course' },
          { to: '/choose', label: 'Choose' },
          { to: '/class', label: 'Class' },
          { to: '/overview', label: 'Overview' },
        ]}
      />
      <Switch>
        <Route path="/student">
          <DataTable
            tableName="student"
            dataQuery={{
              queryText:
                'select s.stu_id, s.stu_name, s.sex, s.entrance_age, s.entrance_year, s."class",' +
                ' ROUND(AVG(c.score), 2) from public.student s left join public.choose c on s.stu_id ' +
                '= c.stu_id group by s.stu_id, s.stu_name, s.entrance_age, s.entrance_year, s."class", s.sex',
              values: [],
            }}
            queryKeys={['stu_id']}
            columns={[
              { field: 'stu_id', headerName: 'ID', width: 100 },
              {
                field: 'stu_name',
                headerName: 'Name',
                width: 120,
                editable: true,
              },
              {
                field: 'sex',
                headerName: 'Gender',
                width: 120,
                editable: true,
              },
              { field: 'class', headerName: 'Class', editable: true },
              {
                field: 'entrance_age',
                headerName: 'Entrance Age',
                width: 150,
                editable: true,
              },
              {
                field: 'entrance_year',
                headerName: 'Entrance Year',
                width: 150,
                editable: true,
              },
              {
                field: 'round',
                headerName: 'Average Score',
                width: 170,
              },
            ]}
            allowInsert
            allowDelete
          />
        </Route>
        <Route path="/teacher">
          <DataTable
            tableName="teacher"
            dataQuery={{
              queryText: 'SELECT tea_id, tea_name FROM teacher',
              values: [],
            }}
            queryKeys={['tea_id']}
            columns={[
              { field: 'tea_id', headerName: 'ID' },
              { field: 'tea_name', headerName: 'Name', editable: true },
            ]}
            allowInsert
            allowDelete
          />
        </Route>
        <Route path="/course">
          <DataTable
            tableName="course"
            dataQuery={{
              queryText:
                'select c.cour_id, c.cour_name, c.tea_id, c.credit, c.grade, c.cancel_year, ' +
                'ROUND(AVG(c2.score), 2) from public.course c left join public.choose c2 on c.cour_id' +
                ' = c2.cour_id group by c.cour_id, c.cour_name, c.tea_id, c.grade, c.cancel_year, c.credit',
              values: [],
            }}
            queryKeys={['cour_id']}
            columns={[
              { field: 'cour_id', headerName: 'ID' },
              {
                field: 'cour_name',
                headerName: 'Name',
                editable: true,
                width: 150,
              },
              {
                field: 'tea_id',
                headerName: 'Teacher ID',
                editable: true,
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
            allowInsert
            allowDelete
          />
        </Route>
        <Route path="/choose">
          <DataTable
            tableName="choose"
            dataQuery={{
              queryText:
                'select c.stu_id, s.stu_name, c.cour_id, c.score, c2.cour_name, c.choose_year ' +
                'from public.choose c inner join public.course c2 on c.cour_id = c2.cour_id ' +
                'inner join public.student s on c.stu_id = s.stu_id',
              values: [],
            }}
            queryKeys={['stu_id', 'cour_id', 'choose_year']}
            columns={[
              {
                field: 'stu_id',
                headerName: 'Student ID',
                width: 130,
                editable: true,
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
                editable: true,
              },
              {
                field: 'cour_name',
                headerName: 'Course Name',
                width: 150,
              },
              { field: 'score', headerName: 'Score' },
              {
                field: 'choose_year',
                headerName: 'Choose Year',
                width: 150,
                editable: true,
              },
            ]}
            allowInsert
            allowDelete
          />
        </Route>
        <Route path="/class">
          <DataTable
            tableName=""
            dataQuery={{
              queryText:
                'select s."class", ROUND(AVG(c.score), 2) from public.student s left join ' +
                'public.choose c on s.stu_id = c.stu_id group by s."class"',
              values: [],
            }}
            queryKeys={[]}
            columns={[
              {
                field: 'class',
                headerName: 'Class',
                width: 120,
              },
              {
                field: 'round',
                headerName: 'Average Score',
                width: 170,
              },
            ]}
          />
        </Route>
        <Route path="/overview">
          <Overview />
        </Route>
        <Route path="/">
          <Redirect to="/student" />
        </Route>
      </Switch>
    </Box>
  );
}
