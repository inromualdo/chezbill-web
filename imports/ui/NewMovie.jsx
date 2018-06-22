import React, { Component } from 'react';
import { saveMovie } from '../api/saveMovie';
import Image from '../model/Image';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DatePicker from 'material-ui-pickers/DatePicker';
import Grid from '@material-ui/core/Grid';

// NewMovie component - represents a movie item form
export default class NewMovie extends Component {

    state = {
        movie: {
            proposedDate1: new Date(),
            proposedDate2: new Date(new Date().getTime() + 86400000)
        },
        loading: false
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        const movie = this.state.movie;
        movie[name] = value
        this.setState(movie)
    }

    handleDate1 = (date) =>{
        const movie = this.state.movie;
        movie["proposedDate1"] = date
        this.setState(movie)
    }

    handleDate2 = (date) =>{
        const movie = this.state.movie;
        movie["proposedDate2"] = date
        this.setState(movie)
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.fileInput.files.length == 0) {
            alert("Ajouter une image");
            return;
        }

        const movie= {...this.state.movie}
        movie.proposedDate1= new Date(movie.proposedDate1).getTime()
        movie.proposedDate2= new Date(movie.proposedDate2).getTime()

        saveMovie.call(movie,
            (err, res) => {
                if (err) {
                    alert(err);
                } else {
                    const uploader = Image.insert({
                        file: this.fileInput.files[0],
                        streams: 'dynamic',
                        chunkSize: 'dynamic',
                        meta: { movieId: res }
                    }, false);

                    uploader.on('start',()=>{
                        this.setState({
                            loading: true
                        })
                    })

                    uploader.on('end', (error, fileObj) => {
                        console.log('end');
                        this.setState({
                            loading: false
                        })
                    })

                    uploader.start()
                }
            });
    }

    render() {
        return (
            <div className="formIn">
                <b className='title'>Ajouter un nouveau film</b>

                <form className="marge60" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid container spacing={24}>
                        <Grid item md={6}>
                            <TextField fullWidth name="title" onChange={this.handleInputChange} label="Titre" required={true} />
                        </Grid>
                        <Grid item md={6}>
                            <TextField fullWidth type="text" name="target" onChange={this.handleInputChange} className="form-control" label="Cible visée" required={true} />
                        </Grid>
                    </Grid>
                    <Grid container className="marge30">
                        <Grid item md={12}>
                            <TextField fullWidth multiline rowsMax="6" type="text" minLength="50" name="synopsis" onChange={this.handleInputChange} className="form-control" label="Synopsis" required={true} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="marge30">
                        <Grid item md={6}>
                            <DatePicker value={this.state.movie.proposedDate1} fullWidth name="date1" onChange={this.handleDate1} label="Date proposée 1" required={true} autoOk={true} cancelLabel="Fermer" disablePast={true} format="DD/MM/YYYY"/>
                        </Grid>
                        <Grid item md={6}>
                            <DatePicker value={this.state.movie.proposedDate2} fullWidth name="date2" onChange={this.handleDate2} label="Date proposée 2" required={true} autoOk={true} cancelLabel="Fermer" disablePast={true} format="DD/MM/YYYY"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={24} className="marge60" >
                        <Grid item md={6}>
                            <Button>
                                <input type="file" name="image" className="form-control" ref={input => { this.fileInput = input; }} />
                            </Button>
                        </Grid>
                        <Grid item md={6}>
                            <Button type="submit" variant="contained" color="secondary" disabled={this.state.loading}> {this.state.loading ? "Enregistrement en cours..." : "Soumettre"}</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}