import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Card, CardContent, CardMedia, Container, Divider, Link, Grid, Typography } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { getAppsForOrg } from '../services/aragon-data';
import { imageForContract, nameForContract } from '../services/format-helpers';

import { Connect } from '@aragon/connect-react';

const BrowseDepartments = ({ address }) => {

  const [apps, setApps] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getAppsForOrg(address);
      setApps(response)
    }
    fetchData()
  }, [address])

  return (
    <React.Fragment>
      <Typography variant='h2'>
        Browse Departments
      </Typography>
      <Grid container direction="row" spacing={2} alignItems="stretch" justify="flex-start">
        {apps.map((row) => (
          <Grid item xs={6} sm={4} md={2}>
            <Link underline='none' component={RouterLink} to={`/department/${row.address}`}>
              <Card>
                <CardMedia
                  style={{ backgroundSize: 'contain', marginTop: '1rem' }}
                  title={row.name || row.address}
                  image={imageForContract(row.address)}
                />
                <CardContent>
                  <Typography color='secondary' variant='h5' gutterBottom>
                    {row.name || row.address}
                  </Typography>
                  <Typography color='textSecondary' variant='body2'>
                    {row.members.length} members - {row.votes} votes
                  </Typography>
                  <AvatarGroup max={5}>
                    {row.members.map((row) => (
                      <Avatar style={{ backgroundColor: `#${row.user.id.slice(3, 9)}cc` }} />
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

const OrgHeadline = ({ address }) => (
  <React.Fragment>
      <Avatar alt={nameForContract(address)} src={imageForContract(address)} style={{ width: 140, height: 140 }} />
      <Typography variant='h1'>
        { nameForContract(address) }
      </Typography>
    </React.Fragment>
)

const Org = ({ address }) => {

  return (
    <Connect location={address} connector="thegraph" options={{ chainId: 4 }}>
      <Container maxWidth="large" style={{ minHeight: "40vh" }}>
        <OrgHeadline address={address} />
        <Divider />
        <BrowseDepartments address={address}/>
      </Container>
    </Connect>
  );
}

export default Org;