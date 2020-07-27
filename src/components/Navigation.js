import React from 'react';
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Container, Link } from "@material-ui/core";

const Navigation = ({ org, department, user, issue }) => {

  return (
    <Container maxWidth="large" style={{ minHeight: 60 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline='none' component={RouterLink} to={`/`}>Home</Link>
        {org && (<Link underline='none' component={RouterLink} to={`/org/${org}`}>Org</Link>)}
        {department && (<Link underline='none' component={RouterLink} to={`/department/${department}`}>Department</Link>)}
        {department && user && (<Link underline='none' component={RouterLink} to={`/department/${department}/member/${user}`}>User</Link>)}
        {department && issue && (<Link underline='none' component={RouterLink} to={`/department/${department}/issue/${issue}`}>Issue</Link>)}
        {/* <Link underline='none' component={RouterLink} to={`/user`}>User</Link> */}
      </Breadcrumbs>
    </Container>
  );
}

export default Navigation;