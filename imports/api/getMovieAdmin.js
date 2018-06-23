import {
  ValidatedMethod
} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {
  Movie
} from '../model/Movie';
import {
  Proposition
} from '../model/Proposition';
import {
  Note
} from '../model/Note';


export const getMovieAdmin = new ValidatedMethod({
  name: 'admin.getMovieAdmin',
  validate: new SimpleSchema({
    id: {
      type: String
    }
  }).validator(),
  run({
    id
  }) {

    const movie = Movie.findOne({
      _id: id
    });

    if (movie && !movie.finalSelected) {
      //Envoyer les propositions
      movie.propositions = Proposition.find({
        movieId: movie._id
      }).fetch()

    } else {
      //Envoyer les survey mobile
      movie.notes= Note.find({
        movieId: movie._id
      }).fetch();
      
    }


    return movie;
  }
});