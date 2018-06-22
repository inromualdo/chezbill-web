import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Movie } from '../model/Movie';

export const getMovie = new ValidatedMethod({
    name: 'admin.getMovie',
    validate: new SimpleSchema({
      id: { type: String }
    }).validator(),
    run({ id }) {
  
      const movie= Movie.findOne({
          _id: id
      });
      

      return movie;
    }
  });