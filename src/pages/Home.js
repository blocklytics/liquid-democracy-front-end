import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Button, Card, CardContent, CardMedia, Container, Link, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { getOrgs } from '../services/aragon-data';
import { imageForContract, nameForContract } from '../services/format-helpers';

function BrowseOrgs() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getOrgs();
      setOrgs(response)
    }
    fetchData()
  }, [])

  return (
    <React.Fragment>
      <Typography variant='h2'>
        Browse Orgs
      </Typography>
      <Grid container spacing={2} alignItems='stretch'>
        {orgs && orgs.map((row) => (
          <Grid item xs={12} sm={6} md={4}>
            <Link underline='none' component={RouterLink} to={`/org/${row.address}`}>
              <Card>
                <CardMedia 
                  title={nameForContract(row.address)}
                  image={imageForContract(row.address)}
                />
                <CardContent>
                  <Typography color='secondary' variant='h5' gutterBottom>
                    {nameForContract(row.address)} ›
                  </Typography>
                  <Typography color='textSecondary' variant='body2'>
                    {row.departments.length} departments
                  </Typography>
                  <AvatarGroup max={5}>
                    {row.departments.map((row) => (
                      <Avatar alt={row.name} src={imageForContract(row.id)} />
                    ))}
                  </AvatarGroup>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}

function CreateOrg() {
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <Typography variant='h2'>
          Create a New Liquid Democracy on Aragon
        </Typography>
      </Grid>
      <Grid item>
        <Button color='primary' variant='contained' size='large'>Go there</Button>
      </Grid>
    </Grid>
  )
}

function Headline() {
  return (
    <Grid container direction="row" style={{ minHeight: "60vh" }} alignItems="center" justify="center" spacing={2}>
      <Grid item xs={12} sm={6} md={8}>
        <Typography color='primary' variant='overline'>
          Vote Delegation on Aragon
        </Typography>
        <Typography variant='h1'>
          Your Vote Scales
        </Typography>
        <Typography variant='subtitle1'>
          Make every vote count for every voter. Based on the principles of liquid democracy.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Link underline='none' component={RouterLink} to={`/org/0x6440fcb29dc25b184420001bfd64fdb0ce4f73b0`}>
          <Card>
            <CardMedia 
              title={nameForContract("0x6440fcb29dc25b184420001bfd64fdb0ce4f73b0")}
              image={imageForContract("0x6440fcb29dc25b184420001bfd64fdb0ce4f73b0")}
            />
            <CardContent>
              <Typography color='secondary' variant='h5' gutterBottom>
                {nameForContract("0x6440fcb29dc25b184420001bfd64fdb0ce4f73b0")} ›
              </Typography>
              <Typography color='textSecondary' variant='body2'>
                5 departments
              </Typography>
              <AvatarGroup max={5}>
                  <Avatar alt="Department of Education" src={imageForContract("0x03b2724fd50f62122a355ba3226ad8c15ec26bbc")} />
                  <Avatar alt="" src={imageForContract("0x27865c9fadff972e28786125cee417f56864e169")} />
                  <Avatar alt="Department of the Interior" src={imageForContract("0x293ae161ed6e5cf7419144067c662068bb2a4bd2")} />
                  <Avatar alt="Environmental Protection Agency" src={imageForContract("0xc753e572262cf87c927276cfceb288530873f958")} />
                  <Avatar alt="Executive" src={imageForContract("0xcb4656aa9da9f5399e5066925e7a5924ebf9df4f")} />
              </AvatarGroup>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </Grid>
  );
}

function Home() {
  const theme = useTheme();
  return (
    <React.Fragment>
      <Container maxWidth={false} disableGutters style={{ background: theme.palette.secondary['100'] }}>
        <Container maxWidth="large">
          <Headline />
        </Container>
      </Container>
      <Container maxWidth={false} disableGutters style={{ minHeight: '60vh' }}>
        <Container maxWidth="large">
          <BrowseOrgs />
        </Container>
      </Container>
      <Container maxWidth={false} disableGutters style={{ minHeight: "30vh", background: theme.palette.secondary['100'] }}>
        <Container maxWidth="large">
          <CreateOrg />
        </Container>
      </Container>
    </React.Fragment>
  );
}

export default Home;