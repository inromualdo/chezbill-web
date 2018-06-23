import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { getMovieAdmin } from '../api/getMovieAdmin';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

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
        selectedSexe: "N"
    }

    componentDidMount() {
        const id = FlowRouter.current().params._id

        getMovieAdmin.call({ id },
            (err, movie) => {
                if (err) {
                    alert(err);
                } else {
                    this.setState({
                        movie: movie
                    })
                }
            });
    }

    check10 = (numb) =>{
        var t= numb
        if(numb < 10){
            t= `0${numb}`
        }
        return t
    }

    getDate = (dateNum) => {
        const d = dateNum ? new Date(dateNum) : new Date()
        return `${this.check10(d.getDate())}/${this.check10(d.getMonth())}/${d.getFullYear()}`
    }

    getHour = (dateNum) => {
        const d = new Date(Number(dateNum))
        var h= d.getHours();
        return `${this.check10(d.getHours())}h ${this.check10(d.getMinutes())}`
    }

    handleDateChange = (event) =>{
        const value = event.target.value;
        this.setState({
            selectedDate: value
        })
    }

    handleSexeChange = (event) =>{
        const value = event.target.value;
        this.setState({
            selectedSexe: value
        })
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

        if(this.state.selectedSexe != "N"){
            propositions= _.where(propositions, {sexe: this.state.selectedSexe})
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
                const nb= propositions[propsition].length
                views.push(
                    <div key={propsition} className={this.props.classes.root}>
                        <Grid container spacing={24}>
                            <Grid item md={12} lg={12} className="mt-3 mb-3">
                                <div><b>{this.getHour(propsition)}</b></div>
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

        return (
            <div className="formIn">
                <b className='title'>{this.state.movie.title}</b>

                <Grid container spacing={24} className="marge30">
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
                            <MenuItem value={0}>{this.getDate(this.state.movie.proposedDate1)}</MenuItem>
                            <MenuItem value={1}>{this.getDate(this.state.movie.proposedDate2)}</MenuItem>
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
                <div className="marge60">
                {this.renderList()}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Calendar);