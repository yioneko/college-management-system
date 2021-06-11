import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import React, { useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { PwdInput } from '../components/PwdInput';
import { db } from '../db';
import { UserCtx } from '../utils/context';
import { checkPwd } from '../utils/password';
import type { Roles } from '../utils/types';

const roleIcons: Record<Roles, typeof AccountCircleIcon> = Object.freeze({
  admin: SupervisorAccountIcon,
  student: AccountCircleIcon,
  teacher: AssignmentIndIcon,
});

function getStoredHash(id: string, role: string) {
  switch (role) {
    case 'admin': {
      return db.query(`SELECT pwd FROM admin WHERE adm_id = $1`, [id]);
    }
    case 'student': {
      return db.query(`SELECT pwd FROM student WHERE stu_id = $1`, [id]);
    }
    case 'teacher': {
      return db.query(`SELECT pwd FROM teacher WHERE tea_id = $1`, [id]);
    }
    default: {
      return Promise.reject(new Error('Internal error: No such role'));
    }
  }
}

const useStyles = makeStyles({
  paper: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: 100,
    padding: 20,
  },
});

export function Login() {
  const [role, setRole] = useState<Roles>('student');
  const [id, setId] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

  const { setUserInfo } = useContext(UserCtx);

  const history = useHistory();
  const [formMsg, setFormMsg] = useState('');
  const handleSubmit = useCallback(() => {
    getStoredHash(id, role)
      .then(({ rows }) => {
        if (rows.length !== 1) {
          throw new Error('No such ID or duplicate ID in database');
        }
        return rows[0].pwd as string;
      })
      .then((storedHash) => checkPwd(pwd, storedHash))
      .then((matched) => {
        if (matched) {
          setUserInfo({ id, role });
          if (history.length >= 1) {
            history.goBack();
          } else {
            history.replace('/');
          }
        } else {
          throw new Error("Password doesn't match for given ID");
        }
      })
      .catch((reason) => {
        setFormMsg(String(reason));
      });
  }, [history, id, pwd, role, setUserInfo]);

  const RoleIcon = roleIcons[role];

  const classes = useStyles();
  return (
    <Paper className={classes.paper} elevation={4}>
      <Grid container direction="column" spacing={1} alignItems="center">
        <Grid item>
          <RoleIcon fontSize="large" />
        </Grid>
        <Grid item>
          <FormControl>
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value as Roles);
              }}
            >
              {['admin', 'student', 'teacher'].map((roleName) => (
                <MenuItem key={roleName} value={roleName}>
                  {roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container item direction="column">
          <Grid item>
            <TextField
              fullWidth
              id="id"
              name="id"
              value={id}
              label="ID"
              onChange={(e) => {
                setId(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <PwdInput
              fullWidth
              id="pwd"
              name="pwd"
              value={pwd}
              label="Password"
              onChange={(e) => {
                setPwd(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            login
          </Button>
        </Grid>
        <Grid item>
          <FormHelperText error>{formMsg}</FormHelperText>
        </Grid>
      </Grid>
    </Paper>
  );
}
