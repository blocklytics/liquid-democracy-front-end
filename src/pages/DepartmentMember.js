import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Collapse, Container, IconButton, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IssueTable from '../components/IssueTable';
import EthereumAvatar, { InlineEthereumAvatar } from '../components/EthereumAvatar';
import { getApp, getDepartmentMember } from '../services/aragon-data';
import { imageForContract, percent, sliceAddress, tokenBalance } from '../services/format-helpers';
import { AccountConsumer } from '../contexts/AccountContext';

const Delegation = ({ connectedAddress, member, delegateFunction, unDelegateFunction }) => {
  let delegableBalance, undelegableBalance = 0;

  delegableBalance = member?.department.members.find((row) => row.user.id.toLowerCase() === connectedAddress?.toLowerCase())?.delegableBalance

  undelegableBalance = member?.currentDelegatedTo.find((row) => row.fromUser.id.toLowerCase() === connectedAddress?.toLowerCase())?.currentBalance

  const tokenAddress = member?.department.token.id;
  const decimals = member?.department.token.decimals;
  const symbol = member?.department.token.symbol;

  const canDelegate = delegableBalance && parseInt(delegableBalance) > 0
  const canUnDelegate = undelegableBalance && parseInt(undelegableBalance) > 0

  return (
    <Paper>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
                <Button 
                  size="large" variant="outlined" color="primary" disabled={!canDelegate}
                  onClick={async () => await delegateFunction(tokenAddress, delegableBalance, member?.user.id)}
                >
                    Delegate
                </Button>
                <Typography color="textSecondary" variant="body2">
                  {canDelegate ? (
                    `You can delegate ${tokenBalance(delegableBalance, decimals)} ${symbol}`
                  ) : (
                    `You have no voting power to delegate`
                  )}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Button 
                  size="large" variant="outlined" color="secondary" disabled={!canUnDelegate}
                  onClick={async () => await unDelegateFunction(tokenAddress, undelegableBalance, member?.user.id)}
                >
                    Undelegate
                </Button>
                <Typography color="textSecondary" variant="body2">
                  {canUnDelegate ? (
                    `You can undelegate ${tokenBalance(undelegableBalance, decimals)} ${symbol}`
                  ) : (
                    `You have not delegated any voting power to this user`
                  )}
                </Typography>
            </Grid>
        </Grid>
    </Paper>
  );
}

const VotePowerSummary = ({ member }) => {
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const  decimals = member?.department?.token?.decimals;

    return (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography variant='h5'>
                    Voting&nbsp;Power
                  </Typography>
                  <Typography color='textSecondary' variant='body2'>
                    Network&nbsp;strength
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant='h5'>
                    {tokenBalance(member?.votingPower, decimals)}
                  </Typography>
                  <Typography color='textSecondary' variant='body2'>
                    {percent(member?.votingPowerPercent)}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography color='textSecondary' variant='body2'>
                    Undelegated&nbsp;Votes
                  </Typography>
                  <Typography variant='h5'>
                    {tokenBalance(member?.votingPower, decimals)}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color='textSecondary' variant='body2'>
                    Voting power received from other members
                  </Typography>
                  <Typography variant='h5'>
                    {tokenBalance(member?.currentAmountDelegatedFrom, decimals)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                    <IconButton aria-label="expand row" size="large" onClick={() => setOpen1(!open1)}>
                        {open1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
              </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                        <Collapse in={open1} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                              <TableContainer component="div">
                                <Table aria-label="simple table">
                                  <TableBody>
                                    {member?.currentDelegatedFrom.map((row) => (
                                      <TableRow hover component={RouterLink} to={`/department/${member.department.id}/member/${row.toUser.id}`}>
                                        <TableCell>
                                          <InlineEthereumAvatar address={row.toUser.id} />
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="body1" gutterBottom component="div">
                                              {tokenBalance(row.currentBalance, decimals)}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                              </TableContainer>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
              <TableRow>
                <TableCell>
                  <Typography color='textSecondary' variant='body2'>
                    Voting power delegated to other members
                  </Typography>
                  <Typography variant='h5'>
                    {tokenBalance(member?.currentAmountDelegatedTo, decimals)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                    <IconButton aria-label="expand row" size="large" onClick={() => setOpen2(!open2)}>
                        {open2 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
              </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                    <Collapse in={open2} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <TableContainer component="div">
                            <Table aria-label="simple table">
                              <TableBody>
                                {member?.currentDelegatedTo.map((row) => (
                                  <TableRow hover component={RouterLink} to={`/department/${member.department.id}/member/${row.fromUser.id}`}>
                                    <TableCell>
                                      <InlineEthereumAvatar address={row.fromUser.id} />
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body1" gutterBottom component="div">
                                          {tokenBalance(row.currentBalance, decimals)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
                
            </TableBody>
          </Table>
        </TableContainer>
    )
}

const Profile = ({ member }) => {
  return (
    <Grid container direction="row" spacing={1} alignItems="center">
      <Grid item>
        <EthereumAvatar address={member?.user?.id} size={72} />
      </Grid>
      <Grid item>
        <Typography variant="h5">{sliceAddress(member?.user?.id)}</Typography>
        <Typography variant="body1">Member of {member?.department?.name}, Organization</Typography>
      </Grid>
    </Grid>
    );
}

const OtherDepartments = ({ member }) => {
  return (
    <React.Fragment>
      <Typography variant="h2" gutterBottom>
        Also a member of
      </Typography>
      <Grid container direction="row" spacing={1} alignItems="center">
        {member?.user.departments.map((row) => (
          <Grid item xs={4}>
            <RouterLink to={`/department/${row.id}/member/${member.user.id}`}>
              <img alt={row.name} src={imageForContract(row.id)} style={{ width: '100%'}} />
            </RouterLink>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}

const DepartmentMember = ({ department, address }) => {
    const [member, setMember] = useState(null);

    useEffect(() => {
      async function fetchData() {
        const response = await getDepartmentMember(department, address);
        setMember(response)
      }
      fetchData()
    }, [department, address])

    const [app, setApp] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const response = await getApp(department);
        setApp(response)
      }
      fetchData()
    }, [department])

    return (
      <AccountConsumer>
        {({ connectedAddress, delegateFunction, unDelegateFunction }) => (
          <Container maxWidth="large">
            <Grid container direction="row" spacing={4}>
              <Grid item xs={12} sm={4}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Profile member={member} />
                    </Grid>
                    <Grid item>
                        <VotePowerSummary member={member} />
                    </Grid>
                    <Grid item>
                        <OtherDepartments member={member} />
                    </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Delegation connectedAddress={connectedAddress} member={member} delegateFunction={delegateFunction} unDelegateFunction={unDelegateFunction} />
                    </Grid>
                    <Grid item>
                      <Typography variant="h2">
                        Voting History
                      </Typography>
                      {/* <Typography color="textSecondary" variant="body2">
                        Participation rate: {percent(member?.voteParticipationPct, 0)}
                      </Typography> */}
                      <IssueTable votes={app.votes} casts={member?.votesCast} />
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        )}
      </AccountConsumer>
    );
  }

export default DepartmentMember;