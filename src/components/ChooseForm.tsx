import { Typography } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { InsertValuesCtx, UserCtx } from '../utils/context';
import { DataInputField } from './DataInputField';

export function ChooseForm() {
  const {
    userInfo: { id, role },
  } = useContext(UserCtx);
  const { setInsertValues } = useContext(InsertValuesCtx);

  useEffect(() => {
    if (role === 'student') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setInsertValues((values: any) => ({
        ...values,
        stu_id: id,
        score: null,
      }));
    }
  }, [id, role, setInsertValues]);

  if (role === 'teacher') {
    return <Typography>Permission denied!</Typography>;
  }

  return (
    <>
      {role === 'admin' && (
        <DataInputField name="stu_id" label="Student ID" required />
      )}
      <DataInputField name="cour_id" label="Course ID" required />
    </>
  );
}
