import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';

import {
    FlowRouter
  } from 'meteor/ostrio:flow-router-extra';

const styles = theme => ({
    root: {
      flexGrow: 1,
    }
})

// Login component - represents le composant de connexion
class Login extends Component {

    state= {
        loading: false,
        user: {},
        snackOpen: false
    }

    handleClose = () => {
        this.setState({
            snackOpen: false
        })
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        const user = this.state.user;
        user[name] = value
        this.setState(user)
    }

    handleSubmit = (event) =>{
        event.preventDefault();
        const { user } = this.state;

        Meteor.loginWithPassword(user.username, user.password, (error)=>{
            if(error){
                this.setState({
                    snackOpen: true,
                    snackMessage: error.reason
                })
            }else{
                FlowRouter.go('/')
            }
        })
    }

    render(){

        const { classes } = this.props;

        return(
            <div className="formIn">
                <b className='title formIn'>Se connecter</b>

                <form className="marge60" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid container spacing={24}>
                        <Grid item md={3}></Grid>
                        <Grid item md={6}>
                            <TextField fullWidth type="text" name="username" onChange={this.handleInputChange} className="form-control" label="Nom d'utilisateur" required={true} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="marge60">
                        <Grid item md={3}></Grid>
                        <Grid item md={6}>
                            <TextField fullWidth type="password" name="password" onChange={this.handleInputChange} className="form-control" label="Mot de passe" required={true} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="marge60" >
                        <Grid item md={6}></Grid>
                        <Grid item md={6}>
                            <Button type="submit" variant="contained" color="secondary" disabled={_.isEmpty(this.state.user.username) || _.isEmpty(this.state.user.password) || this.state.user.password.length < 6}> Se connecter</Button>
                        </Grid>
                    </Grid>
                </form>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    open={this.state.snackOpen}
                    onClose={this.handleClose}
                    autoHideDuration={5000}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackMessage}</span>}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Login);