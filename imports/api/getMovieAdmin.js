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
    }


    return movie;
  }
});