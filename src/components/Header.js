import React from 'react';
import { AppBar, Grid, Toolbar, Typography, Button } from '@material-ui/core';
import { OnboardConsumer } from '../contexts/OnboardContext';
import EthereumAvatar from '../components/EthereumAvatar';
import { sliceAddress } from '../services/format-helpers';


const Header = () => (
    <OnboardConsumer>
        {({ address, network, onboard }) => {
            const connectedToRinkeby = network === 4
            return (
                <AppBar position="static">
                    <Toolbar>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Grid item xs container direction="row" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6">
                                        Liquid Democracy
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button color="inherit">DevPost</Button>
                                </Grid>
                                <Grid item>
                                    <Button color="inherit">GitHub</Button>
                                </Grid>
                            </Grid>
                            <Grid item>
                                { address ? (
                                    <Grid container direction="row" spacing={1}>
                                        <Grid item xs container direction="column" alignItems="flex-end">
                                            <Grid item>
                                                <Typography variant="body1">
                                                    {sliceAddress(address)}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body2">
                                                    {connectedToRinkeby ? 'Connected' : "Switch to Rinkeby"}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <EthereumAvatar address={address} />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Button 
                                    variant="outlined" 
                                    size="large" 
                                    color="inherit"
                                    onClick={async e => {
                                        e.preventDefault()
                                        const walletSelected = await onboard.walletSelect()
                                    }}
                                    >
                                        Connect
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
    )}}
    </OnboardConsumer>
)

export default Header;