import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useState } from 'react';

export function PwdInput({ InputProps, ...props }: TextFieldProps) {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <TextField
      {...props}
      InputProps={{
        ...InputProps,
        type: showPwd ? 'text' : 'password',
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPwd((val) => !val)}>
              {showPwd ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
