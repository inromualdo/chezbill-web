import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import PropTypes from 'prop-types';
import Images from '../model/Image';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      flexGrow: 1,
    }
})
// MovieView component - represente un film sur la vue
class MovieView extends Component {

    getDate = (dateNum) => {
        const d = dateNum ? new Date(dateNum) : new Date()
        return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    }

    goTo = () => {
        FlowRouter.go('film', { _id: this.props.movie._id })
    }

    render() {
        const { movie, classes } = this.props

        const img = Images.findOne({
            "meta.movieId": movie._id
        });

        var link= ""

        if(img){
            try{
                link= img.versions.original.meta.pipeFrom
                link= link.replace("dl=0","dl=1")
            }catch{
                link= img.link()
            }
        }

        return (
            <div className={classes.root}>
            <Grid container spacing={24}>
                <Grid item md={12} lg={12} className="mt-3 mb-3">
                    <Grid container spacing={24}>
                        <Grid item md={4} lg={4} className="imgContainer">
                            <img src={img ? link : "http://urbanartfair.com/wp-content/uploads/IGOUDMANE-146x97-cm-Huile-et-Acrylique-sur-lin1.jpg"} className="thumb" alt="Image" />
                        </Grid>
                        <Grid item md={8} lg={8}>
                            <div className="title2">{movie.title}</div>
                            <div className="title3">{movie.target}</div>
                            <div className="title3">{this.getDate(movie.proposedDate1) + " | " + this.getDate(movie.proposedDate2)}</div>
                            <div className="content mt-4">{movie.synopsis}</div>

                            <div className="mt-4">
                            <Button className="float-right" color="primary" onClick={this.goTo}>Proposer</Button>
                            </div>
                        </Grid>
                    </Grid>
                <hr />
                </Grid>
                </Grid>
            </div>
        )
    }
}

MovieView.propTypes = {
    //Le film à afficher
    movie: PropTypes.object.isRequired
}

export default withStyles(styles)(MovieView);