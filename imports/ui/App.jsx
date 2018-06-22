import React, { Component } from 'react';
import { Provider } from 'react-redux'
import rootReducer from '../redux/reducers'
import PropTypes from 'prop-types';

import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import moment from 'moment';
import 'moment/locale/fr';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { createStore } from 'redux'
import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#fdcb2f',
    },
    secondary: {
      light: '#1e1e1e',
      main: '#1e1e1e',
      contrastText: '#ffcc00',
    },
  },
});

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  }
};

import NewMovie from './NewMovie';
import ListMovies from './ListMovies';


// App component - represents the whole app
class App extends Component {


  goToLogin = () =>{
    if(Meteor.userId()){
      Meteor.logout((error) =>{
        if(!error){
          FlowRouter.go('/')
        }
      })
    }else{
      FlowRouter.go('login')
    }
  }


  render() {

    const { classes } = this.props;

    return (
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={MomentUtils}
          moment={moment}
          locale="fr">
          <MuiThemeProvider theme={theme}>
            <div className={classes.root}>
              <AppBar position="static" color="primary">
                <Toolbar>
                  <Typography variant="title" color="secondary" className={classes.flex}>
                    CHEZ BILL
                  </Typography>
                  <Button color="inherit" onClick={this.goToLogin}>{ Meteor.userId() ? "SE DECONNECTER" : "ADMIN"}</Button>
                </Toolbar>
              </AppBar>
              <div className="container main">
                <Grid container spacing={24}>
                  <Grid item md={2}></Grid>
                  <Grid item md={8}>
                    {this.props.content}
                  </Grid>
                </Grid>
              </div>
            </div>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </Provider>
    );
  }
}

App.propTypes = {
  content: PropTypes.object,
}

export default withStyles(styles)(App)