import { CssBaseline, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import type { UserInfo, UserInfoCtxType } from '../utils/context';
import { UserCtx } from '../utils/context';
import { Admin } from './Admin';
import { Login } from './Login';
import { Student } from './Student';
import { Teacher } from './Teacher';

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  return (
    <>
      <Router>
        <CssBaseline />
        <UserCtx.Provider value={{ userInfo, setUserInfo } as UserInfoCtxType}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              {userInfo ? (
                () => {
                  switch (userInfo.role) {
                    case 'admin':
                      return <Admin />;
                    case 'teacher':
                      return <Teacher />;
                    case 'student':
                      return <Student />;
                    default:
                      return (
                        <Typography>Internal error: No such role</Typography>
                      );
                  }
                }
              ) : (
                <Redirect push to="/login" />
              )}
            </Route>
          </Switch>
        </UserCtx.Provider>
      </Router>
    </>
  );
}
