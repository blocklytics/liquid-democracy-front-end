import React, { createContext, useState, useEffect } from 'react'
import { initOnboard } from '../services/onboard.js'
import ERC20Artifact from '../abis/erc20.json'
import DelegableMiniMeTokenArtifact from '../abis/DelegableMiniMeToken.json'
import DelegableVotingArtifact from '../abis/DelegableVoting.json'
import Web3 from 'web3'

const OnboardContext = createContext()

export const OnboardProvider = ({ children }) => {
  const [onboard, setOnboard] = useState(null)

  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  const [balance, setBalance] = useState(null)

  const [provider, setProvider] = useState(null)
  const [web3, setWeb3] = useState(null)

  var BN = Web3.utils.BN

  useEffect(() => {
    setOnboard(
      initOnboard({
        address: address => {
          setAddress(address)
        },
        network: network => {
          setNetwork(network)
        },
        balance: balance => {
          setBalance(balance)
        },
        wallet: wallet => {
          if (wallet.provider) {
            setProvider(wallet.provider)
            setWeb3(new Web3(wallet.provider))
          }
        },
      }),
    )
  }, [])

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem(
      'selectedWallet',
    )

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])

  async function readyToTransact() {
    if (!provider) {
      const walletSelected = await onboard.walletSelect()
      if (!walletSelected) return false
    }

    const readyToTransact = await onboard.walletCheck()
    if (!readyToTransact) return false

    return true
  }

  async function tokenTotalSupplyOf(contractAddress) {
    if (!provider) {
      console.log('Missing provider')
      return
    }

    if (!contractAddress) {
      console.log('Missing contractAddress')
      return
    }

    let tokenContract = new web3.eth.Contract(ERC20Artifact, contractAddress)
    let resultForTotalSupply = await tokenContract.methods.totalSupply().call()

    return new BN(resultForTotalSupply)
  }

  /**
   * @notice Calls the DelegableMiniMeToken delegate function
   * @param {string} tokenAddress Department's token address
   * @param {string} amount in wei
   * @param {string} delegate Delegate's ethereum address
   */
  async function delegateFunction(tokenAddress, amount, delegate) {
    if (!provider) {
      console.log('Missing provider')
      return
    }

    if (!tokenAddress) {
      console.log('Missing tokenAddress')
      return
    }

    let tokenContract = new web3.eth.Contract(DelegableMiniMeTokenArtifact, tokenAddress)
    let resultForDelegate = await tokenContract.methods.delegate(delegate, amount).send({
      from: address
    })

    return resultForDelegate
  }

  /**
   * @notice Calls the DelegableMiniMeToken undelegate function
   * @param {string} tokenAddress Department's token address
   * @param {string} amount in wei
   * @param {string} delegate Delegate's ethereum address
   */
  async function unDelegateFunction(tokenAddress, amount, delegate) {
    if (!provider) {
      console.log('Missing provider')
      return
    }

    if (!tokenAddress) {
      console.log('Missing tokenAddress')
      return
    }

    let tokenContract = new web3.eth.Contract(DelegableMiniMeTokenArtifact, tokenAddress)
    let resultForDelegate = await tokenContract.methods.undelegate(delegate, amount).send({
      from: address
    })

    return resultForDelegate
  }
  
  /**
   * @notice Calsl the DelegableVoting vote function
   * @param {string} contractAddress Department address
   * @param {int} voteNum Vote number
   * @param {bool} supportBool For or Against vote?
   * @param {bool} executeIfDecidedBool Always set to false for now
   */
  async function voteFunction(contractAddress, voteNum, supportBool, executeIfDecidedBool=false) {
    if (!provider) {
      console.log('Missing provider')
      return
    }

    if (!contractAddress) {
      console.log('Missing contractAddress')
      return
    }

    let votingContract = new web3.eth.Contract(DelegableVotingArtifact, contractAddress)
    let resultForVote = await votingContract.methods.vote(voteNum, supportBool, executeIfDecidedBool).send({
      from: address
    })

    return resultForVote
  }

  return (
    <OnboardContext.Provider
      value={{
        onboard,
        address,
        network,
        balance,
        provider,
        web3,
        readyToTransact,
        delegateFunction,
        unDelegateFunction,
        voteFunction
      }}
    >
      {children}
    </OnboardContext.Provider>
  )
}

export const OnboardConsumer = OnboardContext.Consumer
