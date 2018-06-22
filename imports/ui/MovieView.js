import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import PropTypes from 'prop-types';
import Images from '../model/Image';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// MovieView component - represente un film sur la vue
export default class MovieView extends Component {

    getDate=(dateNum)=>{
        const d=  dateNum ? new Date(dateNum) : new Date()
        return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    }

    goTo=()=>{
        FlowRouter.go('film', { _id: this.props.movie._id })
    }

    render() {
        const { movie } = this.props

        const img= Images.findOne({
            "meta.movieId": movie._id
        });
        
        return (
            <div className="movierow">
                <div className="row mt-3 mb-3">
                <Grid container spacing={24}>
                    <Grid item md={5} className="imgContainer">
                    <img src={img ? img.link(): "http://urbanartfair.com/wp-content/uploads/IGOUDMANE-146x97-cm-Huile-et-Acrylique-sur-lin1.jpg"} className="thumb" alt="Image"/>
                    </Grid>
                    <Grid item md={7}>
                    <div className="title2">{movie.title}</div>
                    <div className="title3">{movie.target}</div>
                    <div className="title3">{this.getDate(movie.proposedDate1) +" | "+ this.getDate(movie.proposedDate2)}</div>
                    <div className="content mt-4">{movie.synopsis}</div>

                    <Button className="float-right mt-4" variant="contained" color="primary" onClick={this.goTo}>Proposer</Button>
                    </Grid>
                </Grid>
            </div>
            <hr/>
            </div>
        )
    }
}

MovieView.propTypes = {
    //Le film à afficher
    movie: PropTypes.object.isRequired
}