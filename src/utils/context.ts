/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';

export interface UserInfo {
  role: 'student' | 'teacher' | 'admin';
  id: string;
}

export interface UserInfoCtxType {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | undefined>>;
}

export const UserCtx = React.createContext<UserInfoCtxType>(null!);

export interface InsertValuesState<S = any> {
  insertValues: S;
  setInsertValues: React.Dispatch<React.SetStateAction<S>>;
}

export const InsertValuesCtx = React.createContext<InsertValuesState>(null!);
