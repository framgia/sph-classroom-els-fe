import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthService from '../../../services/AuthService';
import Navbar from '../../../components/NavigationBar';

const StudentRoute = ({ component: Component, name, ...rest }) => {
  return (
    <Fragment>
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Component */}
      <Route
        {...rest}
        render={(props) => {
          if (AuthService.authenticated()) {
            return <Component {...props} />;
          }

          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }}
      ></Route>
    </Fragment>
  );
};

export default StudentRoute;
