import {
    ValidatedMethod
} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {
    Movie
} from '../model/Movie';

export const programMovie = new ValidatedMethod({
    name: 'admin.programMovie',
    validate: new SimpleSchema({
        _id: {
            type: String
        },
        date: {
            type: Number
        }
    }).validator(),
    run({
        _id,
        date
    }) {
        console.log(date);
        if (Meteor.userId() && Meteor.isServer) {
            console.log(_id);

            Movie.update(_id, {
                $set: {
                    finalSelected: new Date().getTime()
                }
            });
        }
    }
});