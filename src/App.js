import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from "./pages/Home";
import Org from "./pages/Org";
import Department from "./pages/Department";
import Issue from "./pages/Issue";
import DepartmentMember from "./pages/DepartmentMember";

import { AccountProvider } from './contexts/AccountContext'
import { OnboardProvider } from './contexts/OnboardContext'

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// Material UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import lightBlue from '@material-ui/core/colors/lightBlue';
import green from '@material-ui/core/colors/green';
import deepOrange from '@material-ui/core/colors/deepOrange';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
  spacing: factor => `${1 * factor}rem`,
  palette: {
    primary: indigo,
    secondary: lightBlue,
    background: {
      default: "#F9FAFC",
      paper: "#F9FAFC"
    }
  },
  typography: {
    h1: {
      fontSize: "5rem",
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: "-0.06rem"
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 2,
      letterSpacing: "-0.01rem",
      marginTop: "2rem"
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.05,
      letterSpacing: "0.02rem"
    },
    subtitle1: {
      fontSize: "1.5rem"
    },
    overline: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: "0.12rem"
    }
  },
  shape: { borderRadius: 24 },
  shadows: [
    "none",
    "inset -18px -18px 12px #dbdcde22, 8px 18px 36px #dbdcdedd, -18px -18px 36px #ffffff, inset 18px 18px 12px #ffffff",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)"
  ],
  overrides: {
    MuiButton: {
      outlined: {
        borderWidth: 2,
      },
      outlinedSizeLarge: {
        padding: "12px 24px",
        fontSize: "1rem",
        fontWeight: 400
      },
      outlinedPrimary: {
        borderWidth: 2,
        color: '#FFFFFF',
        borderColor: green[500],
        backgroundColor: green[500],
        '&:hover': {
          borderWidth: 2,
          backgroundColor: green[800],
          borderColor: green[800],
          color: '#FFFFFF'
        },
        '&:disabled': {
          borderWidth: 2,
          borderColor: 'rgba(0, 0, 0, 0.05)',
          backgroundColor: 'rgba(0, 0, 0, 0.05)'
        }
      },
      outlinedSecondary: {
        borderWidth: 2,
        color: '#FFFFFF',
        borderColor: deepOrange[600],
        backgroundColor: deepOrange[600],
        '&:hover': {
          borderWidth: 2,
          backgroundColor: deepOrange[900],
          borderColor: deepOrange[900],
          color: '#FFFFFF'
        },
        '&:disabled': {
          borderWidth: 2,
          borderColor: 'rgba(0, 0, 0, 0.05)',
          backgroundColor: 'rgba(0, 0, 0, 0.05)'
        }
      },
      disabled: {
        borderWidth: 2,
        backgroundColor: '#FFFFFF'
      }
    },
    MuiDivider: {
      root: {
        height: "8px",
        margin: "0.5rem 0 2rem 0"
      }
    },
    MuiCardContent: {
      root: {
        padding: "1.5rem"
      }
    },
    MuiCardMedia: {
      root: {
        height: "10rem"
      }
    },
    MuiTableRow: {
      root: {
        textDecoration: "none"
      }
    },
    MuiLinearProgress: {
      root: {
        marginTop: "12px",
        height: 10,
        borderRadius: 10
      },
      colorPrimary: {
        backgroundColor: grey[200]
      },
      colorSecondary: {
        backgroundColor: grey[200]
      },
      barColorPrimary: {
        backgroundColor: green[500]
      },
      barColorSecondary: {
        backgroundColor: deepOrange[600]
      },
      base: {
        borderRadius: 10
      }
    }
  }
})

function App() {
  return (
    <div className="App">
      <MuiThemeProvider theme={theme}>
        <Router>
          <OnboardProvider>
            <AccountProvider>
              <Header />

                {/* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
                <Switch>
                  <Route exact path="/org/:id" component={OrgForId} />
                  <Route path="/department/:id/issue/:issue" component={IssueForId} />
                  <Route path="/department/:id/member/:user" component={DepartmentMemberForId} />
                  <Route path="/department/:id" component={DepartmentForId} />
                  {/* <Route path="/user/:id" component={UserForId} /> */}
                  <Route path="/" component={Home} />
                </Switch>
              <Footer />
            </AccountProvider>
          </OnboardProvider>
        </Router>
      </MuiThemeProvider>
    </div>
  );
}

const OrgForId = ({ match }) => (
  <React.Fragment>
    <Navigation org={match.params.id} />
    <Org address={match.params.id} />
  </React.Fragment>
)

const DepartmentForId = ({ match }) => (
  <React.Fragment>
    <Navigation department={match.params.id} />
    <Department address={match.params.id} />
  </React.Fragment>
)

const DepartmentMemberForId = ({ match }) => (
  <React.Fragment>
    <Navigation department={match.params.id} />
    <DepartmentMember department={match.params.id} address={match.params.user} />
  </React.Fragment>
)

const IssueForId = ({ match }) => (
  <React.Fragment>
    <Navigation department={match.params.id} />
    <Issue department={match.params.id} issueNum={match.params.issue} />
  </React.Fragment>
)

// const UserForId = ({ match }) => (
//   <React.Fragment>
//     <Navigation />
//     <User address={match.params.id} />
//   </React.Fragment>
// )

export default App;
