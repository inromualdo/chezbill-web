import SimpleSchema from 'simpl-schema';
export const Proposition = new Mongo.Collection('propositions');

const Schemas = {};

Schemas.Proposition = new SimpleSchema({
    movieId: String,
    name: String,
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    sexe: {
        type: String,
        allowedValues: ["M","F"]
    },
    age: Number,
    createdDate: {
        type: Number,
        autoValue: function() {
            if (this.isInsert) {
              return new Date().getTime();
            }
          },
        optional: true,
        denyUpdate: true
    },
    proposedHour1: {
        type: Number,
        denyUpdate: true
    },
    proposedHour2: {
        type: Number,
        denyUpdate: true
    }
});


Proposition.attachSchema(Schemas.Proposition);