import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import { getMovie } from '../api/getMovie';
import { saveProposition } from '../api/saveProposition';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { TimePicker } from 'material-ui-pickers';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        minWidth: 300,
        width: "auto",
        overflow: 'hidden',
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

// MovieProposed component - represente la vue de proposition
class MovieProposed extends Component {

    state = {
        movie: {},
        proposition: {
            sexe: "F"
        },
        loading: false
    }

    getDate = (dateNum) => {
        const d = dateNum ? new Date(dateNum) : new Date()
        return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    }

    componentDidMount() {
        const id = FlowRouter.current().params._id

        getMovie.call({ id },
            (err, movie) => {
                if (err) {
                    alert(err);
                } else {
                    this.setState({
                        movie: movie,
                        proposition: {
                            movieId: movie._id,
                            sexe: "F",
                            proposedHour1: new Date(),
                            proposedHour2: new Date()
                        }
                    })
                }
            });
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        const proposition = this.state.proposition;
        proposition[name] = value
        this.setState(proposition)
    }

    handleHour1 = (date) => {
        const proposition = this.state.proposition;
        proposition["proposedHour1"] = date
        this.setState(proposition);
    }

    handleHour2 = (date) => {
        const proposition = this.state.proposition;
        proposition["proposedHour2"] = date
        this.setState(proposition);
    }

    handleClose = () => {
        this.setState({
            snackOpen: false
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const proposition = { ...this.state.proposition }
        proposition.proposedHour1 = new Date(proposition.proposedHour1).getTime()
        proposition.proposedHour2 = new Date(proposition.proposedHour2).getTime()
        proposition.age = Number(proposition.age)
        this.setState({ loading: true })

        saveProposition.call(proposition,
            (err, res) => {
                if (err) {
                    console.log(err);
                    this.setState({
                        snackOpen: true,
                        snackMessage: err.reason,
                        loading: false
                    })
                } else {
                    this.setState({ loading: false })
                    FlowRouter.go('/')
                }
            })
    }

    render() {

        const { classes } = this.props;

        return (
            <div className="formIn">
                <b className='title'>{this.state.movie.title}</b>
                <form className="marge60" noValidate autoComplete="off" onSubmit={this.handleSubmit} className={classes.root}>
                    <Grid container spacing={24}>
                        <Grid item md={6}>
                            <TextField fullWidth name="name" onChange={this.handleInputChange} label="Nom" required={true} autoComplete='name' />
                        </Grid>
                        <Grid item md={6}>
                            <TextField fullWidth type="text" name="email" onChange={this.handleInputChange} className="form-control" label="Email" autoComplete='email' required={true} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="marge30">
                        <Grid item md={6}>
                            <TextField
                                select
                                label="Sexe"
                                required={true}
                                name="sexe"
                                value={this.state.proposition.sexe}
                                onChange={this.handleInputChange}
                                fullWidth
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}>
                                <MenuItem value={"M"}>Masculin</MenuItem>
                                <MenuItem value={"F"}>Féminin</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item md={6}>
                            <TextField fullWidth type="number" name="age" onChange={this.handleInputChange} className="form-control" label="Age" required={true} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="marge30">
                        <Grid item md={6}>
                            <TimePicker value={this.state.proposition.proposedHour1} fullWidth name="date1" onChange={this.handleHour1} label={`Soit le ${this.getDate(this.state.movie.proposedDate1)} à `} required={true} autoOk={true} cancelLabel="Fermer" disablePast={true} ampm={false} showTodayButton todayLabel="actuel" />
                        </Grid>
                        <Grid item md={6}>
                            <TimePicker value={this.state.proposition.proposedHour2} fullWidth name="date2" onChange={this.handleHour2} label={`Soit le ${this.getDate(this.state.movie.proposedDate2)} à `} required={true} autoOk={true} cancelLabel="Fermer" disablePast={true} ampm={false} showTodayButton todayLabel="actuel" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="marge60" >
                        <Grid item md={6}></Grid>
                        <Grid item md={6}>
                            <Button type="submit" variant="contained" color="secondary" disabled={this.state.loading}> {this.state.loading ? "Enregistrement en cours..." : "Soumettre"}</Button>
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

export default withStyles(styles)(MovieProposed);