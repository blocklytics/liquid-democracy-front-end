import React from 'react';

import { Link as RouterLink } from 'react-router-dom'
import { Grid, LinearProgress, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from '@material-ui/core';

const IssueTable = ({votes, casts}) => {
  function yeaPercent(vote) {
    return parseInt(vote.yea) / (parseInt(vote.yea) + parseInt(vote.nay)) * 100
  }

  function nayPercent(vote) {
    return parseInt(vote.nay) / (parseInt(vote.yea) + parseInt(vote.nay)) * 100
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableBody>
          {votes && votes.map((row) => (
            <TableRow hover key={row.id} component={RouterLink} to={`/department/${row.department.id}/issue/${row.voteNum}`}>
              <TableCell component="th" scope="row">
                <Typography color="textSecondary" variant="body2">
                  {`#${row.voteNum} - ${row.executed ? "Finished" : "Voting"}`}
                </Typography>
                <Typography variant="h5">
                  {row.metadata}
                </Typography>
                <Grid container direction="row" spacing={2} alignItems="center">
                  <Grid item xs={12} sm={9}>
                    <LinearProgress color="primary" variant="determinate" value={yeaPercent(row)} />
                    <LinearProgress color="secondary" variant="determinate" value={nayPercent(row)} />
                  </Grid>
                  <Grid item>
                    { casts && casts[row.voteNum] && (
                      <Typography variant="h5">
                        { casts[row.voteNum].supports ? "For" : "Against" }
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default IssueTable;