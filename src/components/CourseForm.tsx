import React from 'react';
import { DataInputField } from './DataInputField';

export function CourseForm() {
  return (
    <>
      <DataInputField name="cour_id" label="Course ID" required />
      <DataInputField name="cour_name" label="Course Name" required />
      <DataInputField name="tea_id" label="Teacher ID" required />
      <DataInputField name="credit" label="Credit" required />
      <DataInputField name="grade" label="Grade" required />
      <DataInputField name="cancel_year" label="Cancel Year" />
    </>
  );
}
