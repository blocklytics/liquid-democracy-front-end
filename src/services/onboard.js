import Onboard from 'bnc-onboard'

const NETWORK_ID = 4
const BNC_API_KEY = process.env.REACT_APP_BNC_API_KEY
const PORTIS_KEY = process.env.REACT_APP_PORTIS_KEY
const FORTMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const WALLET_CONNECT_KEY = process.env.REACT_APP_WALLET_CONNECT_KEY

export function initOnboard(subscriptions) {
  return Onboard({
    dappId: BNC_API_KEY,
    networkId: NETWORK_ID,
    subscriptions: subscriptions,
    walletSelect: {
      wallets: [
        {
          walletName: 'metamask',
        },
        {
          walletName: 'coinbase',
        },
        {
          walletName: 'trust',
        },
        {
          walletName: 'status',
        },
        {
          walletName: 'portis',
          apiKey: PORTIS_KEY,
        },
        {
          walletName: 'fortmatic',
          apiKey: FORTMATIC_KEY,
        },
        {
          walletName: 'authereum',
          disableNotifications: false,
        },
        {
          walletName: 'walletConnect',
          infuraKey: WALLET_CONNECT_KEY,
        },
      ],
    },
  })
}
