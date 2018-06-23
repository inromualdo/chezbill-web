import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { getMovieAdmin } from '../api/getMovieAdmin';
import { programMovie } from '../api/programMovie';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { DateTimePicker } from 'material-ui-pickers';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    getDate,
    getHour
} from '../utils';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
    }
})

class Calendar extends Component {


    state = {
        movie: {},
        selectedDate: 0,
        selectedSexe: "N",
        dialogOpen: false,
        programDate: new Date()
    }

    componentDidMount() {
        const id = FlowRouter.current().params._id

        getMovieAdmin.call({ id },
            (err, movie) => {
                if (err) {
                    alert(err);
                } else {
                    console.log(movie);
                    this.setState({
                        movie: movie
                    })
                }
            });
    }

    programMovie = () =>{
        programMovie.call({_id: this.state.movie._id, date: new Date(this.state.programDate).getTime()},
            (err, res) => {
                if (err) {
                    alert(err);
                }else{
                    FlowRouter.go("/")
                }
            });
    }

    handleDateChange = (event) => {
        try {
            const value = event.target.value;
            this.setState({
                selectedDate: value
            })
        } catch (error) {
            console.log(error);
        }
    }

    handleSexeChange = (event) => {
        const value = event.target.value;
        this.setState({
            selectedSexe: value
        })
    }

    handleProgramChange = (date) => {
        this.setState({
            programDate: date
        })
    }

    handleClose = () =>{
        this.setState({
            dialogOpen: false
        })
    }

    getNoteString = (numb) =>{
        var value= "Okay"
        switch (numb) {
            case 256:
                value= "Great"
                break;
            case 192:
                value= "God"
                break;
            case 128:
                value= "Okay"
                break;
            case 64:
                value= "Bad"
                break;
            case 0:
                value= "Terrible"
                break;
        
            default:
                break;
        }
    }

    renderList = () => {
        var { movie } = this.state;
        if (!movie) {
            movie = {}
        }
        if (!movie.propositions) {
            movie.propositions = []
        }
        var { propositions } = movie
        const views = [];
        for (const pr of propositions) {
            var p1 = pr.proposedHour1
            p1 = new Date(Number(p1))
            p1.setMilliseconds(0)
            p1.setSeconds(0)
            pr.proposedHour1 = p1.getTime()

            var p2 = pr.proposedHour2
            p2 = new Date(Number(p2))
            p2.setMilliseconds(0)
            p2.setSeconds(0)
            pr.proposedHour2 = p2.getTime()
        }

        if (this.state.selectedSexe != "N") {
            propositions = _.where(propositions, { sexe: this.state.selectedSexe })
        }

        if (!movie.finalSelected) {
            if (this.state.selectedDate == 0) {
                propositions = _.sortBy(propositions, "proposedHour1")
                propositions = _.groupBy(propositions, "proposedHour1")
            } else {
                propositions = _.sortBy(propositions, "proposedHour2")
                propositions = _.groupBy(propositions, "proposedHour2")
            }
            for (const propsition in propositions) {
                const nb = propositions[propsition].length
                views.push(
                    <div key={propsition} className={this.props.classes.root}>
                        <Grid container spacing={24}>
                            <Grid item md={12} lg={12} className="mt-3 mb-3">
                                <div><b>{getHour(propsition)}</b></div>
                                <div><h5 className="little">{nb} Pers</h5></div>
                                <hr />
                            </Grid>
                        </Grid>
                    </div>
                )
            }
        }else{

            var { notes } = movie;

            notes= _.groupBy(notes, "note");

            for (const note in notes) {
                const nb = notes[note].length
                views.push(
                    <div key={note} className={this.props.classes.root}>
                        <Grid container spacing={24}>
                            <Grid item md={12} lg={12} className="mt-3 mb-3">
                                <div><b>{this.getNoteString(Number(note))}</b></div>
                                <div><h5 className="little">{nb} Pers</h5></div>
                                <hr />
                            </Grid>
                        </Grid>
                    </div>
                )
            }
        }

        return views
    }

    render() {

        const { classes } = this.props;

        console.log(this.state.movie);

        return (
            <div className="formIn">
                <b className='title'>{this.state.movie.title}</b>

                <div className={!this.state.movie.finalSelected ? "marge30" : "hide"}>
                <Grid container spacing={24}>
                    <Grid item md={4}>
                        <TextField
                            select
                            value={this.state.selectedDate}
                            onChange={this.handleDateChange}
                            fullWidth
                            label="Date"
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}>
                            <MenuItem value={0}>{getDate(this.state.movie.proposedDate1)}</MenuItem>
                            <MenuItem value={1}>{getDate(this.state.movie.proposedDate2)}</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item md={4}>
                        <TextField
                            select
                            label="Sexe"
                            value={this.state.selectedSexe}
                            onChange={this.handleSexeChange}
                            fullWidth
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}>
                            <MenuItem value={"N"}> </MenuItem>
                            <MenuItem value={"M"}>Masculin</MenuItem>
                            <MenuItem value={"F"}>Féminin</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item md={4}></Grid>
                </Grid>
                </div>
                <div className="marge60">
                    {this.renderList()}
                    <div className={this.state.movie.finalSelected ? "hide" : "marge30"}>
                        <Button className="float-right" color="secondary" onClick={() => this.setState({ dialogOpen: true })}>Programmer</Button>
                    </div>
                </div>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Programmer</DialogTitle>
                    <DialogContent>
                        <DateTimePicker
                            autoOk
                            ampm={false}
                            label="Date et heure"
                            value={this.state.programDate}
                            onChange={this.handleProgramChange}
                            format="DD/MM/YYYY HH:mm "
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Annuler
                            </Button>
                        <Button onClick={this.programMovie} color="primary">
                            Programmer
                            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(Calendar);