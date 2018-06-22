import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux'
import { Meteor } from 'meteor/meteor';
import { Movie } from '../model/Movie';
import MovieView from './MovieView';
import { setPage } from '../redux/actions/setPage';


import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const PER_PAGE = 5

// ListMovies component - represente la liste des films
class ListMovies extends Component {

    state = {
        page: 0,
        total: 0
    }

    renderMovies = () => {
        return this.props.movies.map((movie) => (
            <MovieView key={movie._id} movie={movie} />
        ));
    }

    increasePage = () => {
        if (this.state.total < this.props.total) {
            this.props.dispatch(
                setPage(this.state.page + 1)
            )
            this.setState({
                page: this.state.page + 1,
                total: PER_PAGE * (this.state.page + 2)
            })
        }
    }

    decreasePage = () => {
        this.props.dispatch(
            setPage(this.state.page - 1)
        )
        this.setState({
            page: this.state.page - 1,
            total: this.state.total - PER_PAGE
        })
    }

    render() {
        const { dispatch, total } = this.props;

        return (
            <div className="formIn">
                <b className='title text-center'>FILMS PROPOSEES</b>

                <Grid container spacing={24}>
                    <Grid item md={6}>
                        <Button className="float-left" variant="contained" color="secondary" onClick={(e) => this.decreasePage(e)} disabled={this.state.page == 0}>Précédente</Button>
                    </Grid>
                    <Grid item md={6}>
                        <Button className="float-right" variant="contained" color="secondary" onClick={(e) => this.increasePage(e)} disabled={this.props.movies.length < PER_PAGE || this.state.total >= total}>Suivante</Button>
                    </Grid>
                </Grid>

                <Grid container spacing={24} className="marge30">
                    {this.renderMovies()}
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = (state, _) => ({
    state
})

export default ListMoviesContainer = connect(mapStateToProps)(withTracker(({ state }) => {
    let page = 0
    if (state.moviesPage && state.moviesPage.page) {
        page = state.moviesPage.page
    }
    const subscription = Meteor.subscribe('listOfMovies', page);
    const loading = !subscription.ready();
    const movies = Movie.find().fetch();
    const total = Counts.get("listOfMovies-nb");
    return {
        loading,
        movies,
        total
    };
})(ListMovies));