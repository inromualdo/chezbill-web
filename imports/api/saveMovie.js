import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { Movie } from '../model/Movie';

export const saveMovie = new ValidatedMethod({
    name: 'admin.saveMovie',
    validate: new SimpleSchema({
      title: { type: String },
      target: { type: String },
      synopsis: {type: String },
      proposedDate1: {type: Number },
      proposedDate2: {type: Number }
    }).validator(),
    run({ title, target, synopsis, proposedDate1, proposedDate2 }) {
        
        // if(Meteor.userId){
        //     throw new Meteor.Error("Vous n'êtes pas connecté");
        // }
  
      const movieId= Movie.insert({
          title,
          target,
          synopsis,
          proposedDate1,
          proposedDate2
      });

      return movieId;
    }
  });