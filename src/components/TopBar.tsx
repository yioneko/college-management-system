import { Tabs, Tab, AppBar, makeStyles } from '@material-ui/core';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserMenu } from './UserMenu';

interface LinkTabsProps {
  tabProps: Array<{ to: string; label: string }>;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    flexDirection: 'row',
  },
  tabs: {
    flexGrow: 1,
  },
}));

export function TopBar({ tabProps }: LinkTabsProps) {
  const { pathname } = useLocation();
  const classes = useStyles();
  return (
    <AppBar className={classes.appBar} position="sticky">
      <Tabs variant="scrollable" className={classes.tabs} value={pathname}>
        {tabProps.map(({ to, label }) => (
          // eslint-disable-next-line react/jsx-key
          <Tab component={Link} value={to} to={to} label={label} />
        ))}
      </Tabs>
      <UserMenu />
    </AppBar>
  );
}
