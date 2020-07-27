import React from 'react';

import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@material-ui/core';
import IssueTable from '../components/IssueTable';

function Delegation() {
  return (
    <Paper>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button size="large">Delegate</Button>
        <Typography variant="body2">
          Delegate votes to this candidate
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Button size="large" disabled>Undelegate</Button>
        <Typography variant="body2">
          You do not have any votes to undelegate
        </Typography>
      </Grid>
    </Grid>
    </Paper>
  );
}

const Profile = ({ address }) => (
  <div>
    <Avatar />
    <Typography variant="h5">{ address }</Typography>
  </div>
);

const User = ({ address }) => {
    return (
      <React.Fragment>
        <Typography variant='h5'>User</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Profile address={address} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Delegation />
            <IssueTable />
          </Grid>
        </Grid>
      </React.Fragment>
      );
  }

export default User;