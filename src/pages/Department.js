import React, { useState, useEffect } from 'react';

import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Button, Container, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@material-ui/core';
import { getApp } from '../services/aragon-data';
import IssueTable from '../components/IssueTable';
import EthereumAvatar from '../components/EthereumAvatar';
import { imageForContract, percent, secondsToDays, sliceAddress, tokenBalance } from '../services/format-helpers';

const StakeholderTable = ({ members }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography color="textSecondary" variant="body1">
                Member
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography color="textSecondary" variant="body1">
                Voting&nbsp;Power
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members && members.map((row) => (
            <TableRow hover key={row.id} component={RouterLink} to={`/department/${row.department.id}/member/${row.user.id}`}>
              <TableCell component="th" scope="row">
                <Grid container direction="row" spacing={1} alignItems="center">
                  <Grid item>
                    <EthereumAvatar address={row.user.id} />
                  </Grid>
                  <Grid item xs zeroMinWidth>
                    <Typography variant="body1" noWrap>
                      {sliceAddress(row.user.id)}
                    </Typography>
                    <Typography color='textSecondary' variant="body2" noWrap>
                      Representing {row.currentDelegatedFrom.length} voters
                    </Typography>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body1" noWrap>
                  {percent(row.votingPowerPercent)}
                </Typography>
                <Typography color='textSecondary' variant="body2" noWrap>
                  {`${tokenBalance(row.votingPower, row.department.token.decimals)} ${row.department.token.symbol}`}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const Department = ({ address }) => {
  const [app, setApp] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getApp(address);
      setApp(response)
    }
    fetchData()
  }, [address])

  return (
    <React.Fragment>
      <Container maxWidth="large">
        <Grid container direction="column" style={{ minHeight: "40vh" }} spacing={2}>
          <Grid item>
            <Avatar size="large" src={imageForContract(address)} style={{ width: 140, height: 140 }} />
            <Typography variant='h1'>
              {app.name || "Department"}
            </Typography>
            <Divider />
          </Grid>
          <Grid item container direction="row" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant='subtitle1'>
                Governed by {app.token?.symbol} token
              </Typography>
              <Typography color="textSecondary" variant='body2'>
                - You must be a token holder to start new votes.
              </Typography>
              <Typography color="textSecondary" variant='body2'>
                - There are {`${tokenBalance(app.token?.totalSupply, app.token?.decimals)} ${app.token?.symbol}`} in existence
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant='subtitle1'>
                Voting details
              </Typography>
              <Typography color="textSecondary" variant='body2'>
                - Each vote lasts {secondsToDays(app.voteDuration)} days.
              </Typography>
              <Typography color="textSecondary" variant='body2'>
                - Passing a vote requires {percent(app.supportRequiredPct, 0)} support and a minimum quorum of {percent(app.minAcceptQuorum, 0)}.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant='subtitle1'>
                Your account
              </Typography>
              <Typography color="textSecondary" variant='body2'>
                - You have X tokens
              </Typography>
              <Typography color="textSecondary" variant='body2'>
                - You are eligible to start new votes
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h2">
              Members
            </Typography>
            <StakeholderTable members={app.members}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container direction="row" spacing={2} alignItems="baseline" justify="space-between">
              <Grid item>
                <Typography variant="h2">
                  Votes
                </Typography>
              </Grid>
              <Grid item>
                <Button 
                  color='primary' 
                  variant='outlined' 
                  size='large' 
                  onClick={() =>
                    console.log("start a vote")
                  }
                  >
                    Start a Vote
                  </Button>
              </Grid>
            </Grid>
            <IssueTable votes={app.votes} />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default Department;