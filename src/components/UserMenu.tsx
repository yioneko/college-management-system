import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Divider,
  Dialog,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormHelperText,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { db } from '../db';
import { UserCtx } from '../utils/context';
import { hashPwd } from '../utils/password';
import { PwdInput } from './PwdInput';

function upperFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function standardizeFieldName(field: string): string {
  return field
    .replaceAll('_', ' ')
    .split(' ')
    .map((substr) => upperFirstLetter(substr))
    .join(' ');
}

const useStyles = makeStyles((theme) =>
  createStyles({
    name: {
      marginRight: '2rem',
      display: 'flex',
      alignItems: 'center',
    },
    tableValue: {
      color: theme.palette.text.secondary,
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'center',
    },
    dialogContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  })
);

export function UserMenu() {
  const {
    userInfo: { id, role },
    setUserInfo,
  } = useContext(UserCtx);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userDetail, setUserDetail] = useState<any>({});

  useEffect(() => {
    if (role === 'student') {
      db.query(
        'SELECT stu_name as name, sex, entrance_age, entrance_year, class FROM student WHERE stu_id = $1',
        [id],
        (err, res) => {
          if (!err) {
            setUserDetail(res.rows[0]);
          }
        }
      );
    }

    if (role === 'teacher') {
      db.query(
        'SELECT tea_name as name FROM teacher WHERE tea_id = $1',
        [id],
        (err, res) => {
          if (!err) {
            setUserDetail(res.rows[0]);
          }
        }
      );
    }
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [pwds, setPwds] = useState<{ pwd: string; dupPwd: string }>({
    pwd: '',
    dupPwd: '',
  });
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false);
  const [pwdDialogMsg, setPwdDialogMsg] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const handlePwdReset = useCallback(async () => {
    if (pwds.pwd.length < 6) {
      setPwdDialogMsg('Password length too short');
    } else if (pwds.pwd !== pwds.dupPwd) {
      setPwdDialogMsg('Passwords are not identical');
    } else {
      try {
        const hash = await hashPwd(pwds.pwd);
        switch (role) {
          case 'student': {
            await db.query('UPDATE student SET pwd = $1 WHERE stu_id = $2', [
              hash,
              id,
            ]);
            break;
          }
          case 'teacher': {
            await db.query('UPDATE teacher SET pwd = $1 WHERE tea_id = $2', [
              hash,
              id,
            ]);
            break;
          }
          case 'admin': {
            await db.query('UPDATE admin SET pwd = $1 WHERE adm_id = $2', [
              hash,
              id,
            ]);
            break;
          }
          default: {
            throw new Error('No such role');
          }
        }
      } catch (e) {
        setPwdDialogMsg(String(e));
      }
      setPwdDialogOpen(false);
      setAlertMsg('Password reset successfully');
    }
  }, [id, pwds.dupPwd, pwds.pwd, role]);

  const classes = useStyles();

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
      >
        <AccountCircleOutlinedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
      >
        <Card variant="outlined">
          <CardHeader title={`${upperFirstLetter(role)} ID: ${id}`} />
          <CardContent>
            <Table size="small">
              <TableBody>
                {Object.entries(userDetail).map(([field, value]) => (
                  <TableRow key={field}>
                    <TableCell>{`${standardizeFieldName(field)}`}</TableCell>
                    <TableCell className={classes.tableValue}>
                      {value as string}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            setPwdDialogOpen(true);
          }}
        >
          Reset Password
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setUserInfo(undefined);
          }}
          className={classes.menuItem}
        >
          Logout
        </MenuItem>
        <Dialog
          open={pwdDialogOpen}
          onClose={() => {
            setPwdDialogOpen(false);
          }}
        >
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <PwdInput
              label="Password"
              id="pwd-input"
              value={pwds.pwd}
              name="password"
              onChange={(e) => {
                setPwds((val) => ({ ...val, pwd: e.target.value }));
                setPwdDialogMsg('');
              }}
            />
            <PwdInput
              label="Confirm Password"
              id="dup-pwd-input"
              value={pwds.dupPwd}
              name="dupPassword"
              onChange={(e) => {
                setPwds((val) => ({ ...val, dupPwd: e.target.value }));
                setPwdDialogMsg('');
              }}
            />
            <FormHelperText error>{pwdDialogMsg}</FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePwdReset}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Menu>
      <Typography className={classes.name} component="h6">
        {role === 'teacher' || role === 'student' ? userDetail.name : role}
      </Typography>
      <Snackbar autoHideDuration={5000} open={!!alertMsg}>
        <Alert
          variant="filled"
          severity="success"
          onClose={() => {
            setAlertMsg('');
          }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
