import {
    ValidatedMethod
} from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import {
    Proposition
} from '../model/Proposition';

export const saveProposition = new ValidatedMethod({
    name: 'user.saveProposition',
    validate: new SimpleSchema({
        movieId: {
            type: String
        },
        name: {
            type: String
        },
        email: {
            type: String
        },
        sexe: {
            type: String
        },
        age: {
            type: Number
        },
        proposedHour1: {
            type: Number
        },
        proposedHour2: {
            type: Number
        }
    }).validator(),
    run({
        movieId,
        name,
        email,
        sexe,
        age,
        proposedHour1,
        proposedHour2
    }) {


        //Vérifier si l'utilisateur n'a pas déjà proposé pour ce film

        const pExist = Proposition.findOne({
            movieId,
            email
        });

        if (pExist) {
            throw new Meteor.Error(400, 'Il semble que vous avez déjà proposé un créneau pour ce film');
        }


        Proposition.insert({
            movieId,
            name,
            email,
            sexe,
            age,
            proposedHour1,
            proposedHour2
        });
    }
});