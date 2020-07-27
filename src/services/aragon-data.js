import gql from 'graphql-tag'
import { GraphQLWrapper } from '@aragon/connect-thegraph'

const DELEGABLE_VOTING_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/blocklytics/aragon-delegable-voting-rinkeby"

/**
 * @notice Fetches a list of organizations for the Home page.
 */
export async function getOrgs() {
    const QUERY = gql`
    query {
        liquidDemocracies {
            id
            departments {
                id
                name
            }
        }
    }
    `
    
    const wrapper = new GraphQLWrapper(DELEGABLE_VOTING_SUBGRAPH_URL)
    const results = await wrapper.performQuery(QUERY)
    const orgs = results.data.liquidDemocracies.map((row) => {
        return {
            address: row.id,
            departments: row.departments
        }
    })
    
    return orgs
}

/**
 * @notice Fetches a list of Delegable Voting Apps for the Org page.
 */
export async function getAppsForOrg(address) {
    const QUERY = gql`
    query {
        liquidDemocracy(id: "${address}") {
            departments {
                id
                name
                members(orderBy: "votingPower", orderDirection: "desc") {
                    user {
                        id
                    }
                }
                votes {
                    id
                }
            }
        }
    }
    `
    
    const wrapper = new GraphQLWrapper(DELEGABLE_VOTING_SUBGRAPH_URL)
    const results = await wrapper.performQuery(QUERY)
    const apps = results.data.liquidDemocracy.departments.map((row) => {
        return {
            address: row.id,
            name: row.name,
            members: row.members,
            votes: (row.votes).length
        }
    })
    
    return apps
}

/**
 * @notice Fetches a single Delegable Voting App for the Department page.
 */
export async function getApp(address) {
    const QUERY = gql`
    query {
        department(id: "${address}") {
            id
            name
            supportRequiredPct
            minAcceptQuorum
            voteDuration
            members(orderBy: "votingPower", orderDirection: "desc") {
                department {
                    id
                    token {
                        decimals
                        symbol
                    }
                }
                user {
                    id
                }
                votingPower
                votingPowerPercent
                currentDelegatedFrom {
                    id
                }
            }
            token {
                id
                name
                decimals
                symbol
                totalSupply
            }
            votes(orderBy: "voteNum", orderDirection: "desc") {
                id
                department {
                    id
                }
                metadata
                voteNum
                executed
                yea
                nay
            }
        }
    }
    `
    
    const wrapper = new GraphQLWrapper(DELEGABLE_VOTING_SUBGRAPH_URL)
    const results = await wrapper.performQuery(QUERY)
    const row = results.data.department
    const app = {
        address: row.id,
        name: row.name,
        token: row.token,
        members: row.members,
        votes: row.votes,
        supportRequiredPct: row.supportRequiredPct,
        minAcceptQuorum: row.minAcceptQuorum,
        voteDuration: row.voteDuration
    }
    
    return app
}

/**
 * @notice Fetches a department user for the Department Member page.
 */
export async function getDepartmentMember(department, user) {
    const QUERY = gql`
    query {
        departmentMember(id: "${department}-${user}") {
            user {
                id
                departments {
                    id
                }
            }
            department {
                id
                name
                token {
                    id
                    symbol
                    decimals  
                }
                members {
                    user {
                        id
                    }
                    delegableBalance
                }
            }
            votingPower
            votingPowerPercent
            currentTokenBalance
            currentAmountDelegatedFrom
            currentAmountDelegatedTo
            voteParticipationPct
            votesCast {
                voteNum
                supports
            }
            currentDelegatedFrom(orderBy: "currentBalance", orderDirection: "desc", where:{currentBalance_gt: "0"}) {
                toUser {
                    id
                }
                currentBalance
            }
            currentDelegatedTo(orderBy: "currentBalance", orderDirection: "desc", where:{currentBalance_gt: "0"}) {
                fromUser {
                    id
                }
                currentBalance
            }
            delegatedFromHistory {
                id
            }
            delegatedToHistory {
                id
            }
        }
    }
    `
    
    const wrapper = new GraphQLWrapper(DELEGABLE_VOTING_SUBGRAPH_URL)
    const results = await wrapper.performQuery(QUERY)
    const row = results.data.departmentMember
    
    return row
}

export async function getSnapshotBalance(department, user, block, issueNum) {
    
    const id = department + "-" + user
    const QUERY = gql`
    query {
      departmentMember(id: "${id}", block: {number: ${block}}) {
          votingPower
          department {
              id
              token {
                  symbol
                  decimals
              }
          }
      }
      castVote:departmentMember(id: "${id}") {
        votesCast(where:{voteNum: ${issueNum}}) {
            supports
            voterStake
        }
      }
    }
    `
    
    const wrapper = new GraphQLWrapper(DELEGABLE_VOTING_SUBGRAPH_URL)
    const results = await wrapper.performQuery(QUERY)
    const row = results.data
    
    return row
}

export async function getIssue(department, issue) {
    
  const id = "appAddress:" + department + "-voteId:0x" + issue.toString(16)
  const QUERY = gql`
  query {
    vote(id: "${id}") {
        yea
        nay
        sharesUsed
        metadata
        executed
        snapshotBlock
        creator {
            id
        }
        department {
            id
            token {
                decimals
            }
        }
        startDate
        castsFor:casts(where:{supports:true}) {
            id
            department {
                id
                token {
                    decimals
                }
            }
            voter {
                id
            }
            voterStake
        }
        castsAgainst:casts(where:{supports:false}) {
            id
            department {
                id
                token {
                    decimals
                }
            }
            voter {
                id
            }
            voterStake
        }
    }
  }
  `
  
  const wrapper = new GraphQLWrapper(DELEGABLE_VOTING_SUBGRAPH_URL)
  const results = await wrapper.performQuery(QUERY)
  const row = results.data.vote
  
  return row
}