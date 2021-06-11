import { MenuItem, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { UserCtx } from '../utils/context';
import { DataInputField } from './DataInputField';

export function StudentForm() {
  const {
    userInfo: { role },
  } = useContext(UserCtx);
  if (role !== 'admin') {
    return <Typography>Permission not allowed!</Typography>;
  }

  return (
    <>
      <DataInputField name="stu_id" label="Student ID" required />
      <DataInputField name="stu_name" label="Student Name" required />
      <DataInputField name="sex" label="Gender" select required>
        <MenuItem value="male">male</MenuItem>
        <MenuItem value="female">female</MenuItem>
      </DataInputField>
      <DataInputField name="entrance_age" label="Entrance Age" required />
      <DataInputField name="entrance_year" label="Entrance Year" required />
      <DataInputField name="class" label="Class" required />
      <DataInputField name="pwd" label="Password" required />
    </>
  );
}
