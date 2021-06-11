import { TextField, TextFieldProps } from '@material-ui/core';
import React, { useContext } from 'react';
import { InsertValuesCtx } from '../utils/context';

type DataInputFieldProps = {
  name: NonNullable<TextFieldProps['name']>;
} & Omit<TextFieldProps, 'name'>;

export function DataInputField(props: DataInputFieldProps) {
  const { name, ...textFieldProps } = props;
  const { insertValues, setInsertValues } = useContext(InsertValuesCtx);
  return (
    <TextField
      {...textFieldProps}
      id={`${name}-insert-input`}
      name={name}
      value={insertValues[name]}
      onChange={(e) =>
        setInsertValues((values: any) => ({
          ...values,
          [name]: e.target.value,
        }))
      }
    />
  );
}
