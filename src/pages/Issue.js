import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Button, Container, Divider, Grid, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import { InlineEthereumAvatar } from '../components/EthereumAvatar';
import { getIssue, getSnapshotBalance } from '../services/aragon-data';
import { sliceAddress, tokenBalance } from '../services/format-helpers';
import { AccountConsumer } from '../contexts/AccountContext';

const Vote = ({ voteFunction, snapshotBalance, issueNum }) => {
  const didVote = snapshotBalance?.castVote?.votesCast[0]
  const didVoteInSupport = didVote?.supports

  const votingPower = snapshotBalance && `${tokenBalance(snapshotBalance.departmentMember.votingPower, snapshotBalance.departmentMember.department.token.decimals)} ${snapshotBalance.departmentMember.department.token.symbol}`

  return didVote ? (
    <Paper>
      <Typography color="textSecondary" variant="body2">
        Issue #{issueNum}
      </Typography>
      <Typography variant='h5'>
        You voted {didVoteInSupport ? "For" : "Against"}
      </Typography>
      <Typography variant='h5'>
        {votingPower}
      </Typography>
    </Paper>
  ) : (
    <Paper>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant='h5'>
            Your voting power
          </Typography>
          <Typography variant='h5'>
            {votingPower}
          </Typography>
        </Grid>
        <Grid item container direction="row" spacing={1} alignItems="stretch" justify="center">
          <Grid item xs={6}>
            <Button 
              size="large" variant="outlined" fullWidth={true} color="secondary"
              onClick={() => voteFunction(snapshotBalance?.departmentMember.department.id, issueNum, false)}
            >
                Vote&nbsp;Against
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button size="large" variant="outlined" fullWidth={true} color="primary"
              onClick={() => voteFunction(snapshotBalance?.departmentMember.department.id, issueNum, true)}
            >
                Vote&nbsp;For
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

const CastTable = ({ side='yea', issue }) => {

  let title, color, total, casts, percent;
  if (side === 'yea') {
    title = "For"
    color = "primary"
    total = tokenBalance(issue?.yea, issue?.department.token.decimals)
    casts = issue?.castsFor
    percent = (parseInt(issue?.yea) / (parseInt(issue?.nay) + parseInt(issue?.yea)) * 100).toFixed(0)
  } else {
    title = "Against"
    color = "secondary"
    total = tokenBalance(issue?.nay, issue?.department.token.decimals)
    casts = issue?.castsAgainst
    percent = (parseInt(issue?.nay) / (parseInt(issue?.nay) + parseInt(issue?.yea)) * 100).toFixed(0)
  }
  
  return (
  <TableContainer component={Paper}>
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell component="th" colspan={2}>
            <Grid container direction="row" justify="space-between">
              <Grid item>
                <Typography variant="h5">
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5">
                  {total}
                </Typography>
              </Grid>
            </Grid>
            <LinearProgress color={color} variant="determinate" value={percent} />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {casts && casts.map((row) => (
          <TableRow hover key={row.id} component={RouterLink} to={`/department/${row.department.id}/member/${row.voter.id}`}>
            <TableCell component="th" scope="row">
              <InlineEthereumAvatar address={row.voter.id} />
            </TableCell>
            <TableCell align="right">
              <Typography variant="body1">
                {tokenBalance(row.voterStake, row.department.token.decimals)}
              </Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}

const Issue = ({ connectedAddress, department, issueNum, voteFunction }) => {

  const [issue, setIssue] = useState(null);
  const [snapshotBalance, setSnapshotBalance] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await getIssue(department, issueNum);
      setIssue(response)
    }
    fetchData()
  }, [department, issueNum])

  useEffect(() => {
    async function fetchData() {
      const response = department && connectedAddress && issue && issueNum 
        && await getSnapshotBalance(department, connectedAddress, issue.snapshotBlock, issueNum);
      setSnapshotBalance(response)
    }
    fetchData()
  }, [department, connectedAddress, issue])

  return (
    <Container maxWidth="large">
      <Typography variant="h2">
        {issue?.metadata}
      </Typography>
      <Typography color="textSecondary" variant="body1">
        Created by {sliceAddress(issue?.creator?.id)}
      </Typography>
      <Divider />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={4}>
          <CastTable side="nay" issue={issue} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Vote snapshotBalance={snapshotBalance} connectedAddress={connectedAddress} issueNum={issueNum} voteFunction={voteFunction} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CastTable side="yea" issue={issue} />
        </Grid>
      </Grid>
    </Container>
  );
}

const WrappedIssue = ({ department, issueNum }) => {
  return (
    <AccountConsumer>
      {({ connectedAddress, voteFunction }) => (
        <Issue connectedAddress={connectedAddress} department={department} issueNum={issueNum} voteFunction={voteFunction} />
      )}
    </AccountConsumer>
  )
}

export default WrappedIssue;