import React, { createContext, useState } from 'react'

// Contexts
import { OnboardConsumer } from './OnboardContext'

// 3Box
// const Box = require('3box')

const AccountContext = createContext()

export const AccountProviderBase = ({ children, connectedAddress, delegateFunction, unDelegateFunction, voteFunction }) => {

  const [profile, setProfile] = useState(null)

  // 3Box Profile
  // useEffect(() => {
  //   Box.getProfile(connectedAddress).then(profile => {
  //     if (profile && profile.status !== 'error') {
  //       setProfile(profile)
  //     }
  //   })
  // }, [connectedAddress])

  return (
    <AccountContext.Provider
      value={{
        connectedAddress,
        delegateFunction,
        unDelegateFunction,
        voteFunction,
        profile
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export const AccountProvider = props => {
  return (
    <OnboardConsumer>
      {({ address, delegateFunction, unDelegateFunction, voteFunction }) => (
        <AccountProviderBase
          {...props}
          connectedAddress={address}
          delegateFunction={delegateFunction}
          unDelegateFunction={unDelegateFunction}
          voteFunction={voteFunction}
        />
      )}
    </OnboardConsumer>
  )
}

export const AccountConsumer = AccountContext.Consumer
