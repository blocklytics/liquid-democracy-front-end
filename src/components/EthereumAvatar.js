import React from 'react';
import { Avatar, Grid, Typography } from '@material-ui/core';
import { sliceAddress } from '../services/format-helpers';

export const InlineEthereumAvatar = ({ address, size=24, variant="body1" }) => (
    <Grid container direction="row" spacing={1} justify="baseline">
    <Grid item>
      <EthereumAvatar size={size} address={address} />
    </Grid>
    <Grid item>
      <Typography variant={variant}>
        {sliceAddress(address)}
      </Typography>
    </Grid>
  </Grid>
)

const EthereumAvatar = ({ address, size=48 }) => {
    if (!address) {
        return (
            <Avatar style={{ width: `${size}px`, height: `${size}px` }} />
        )
    }

    return (
        <Avatar style={{ background: `#${address.slice(3,9)}cc`, width: `${size}px`, height: `${size}px` }} />
    )
};

export default EthereumAvatar;