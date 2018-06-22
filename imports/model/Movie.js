import SimpleSchema from 'simpl-schema';
export const Movie = new Mongo.Collection('movies');

const Schemas = {};

Schemas.Movie = new SimpleSchema({
    title: {
        type: String,
        label: "Titre",
        max: 75
    },
    target: {
        type: String,
        label: "Cible visée"
    },
    synopsis: {
        type: String,
        label: "Synopsis",
        min: 20
    },
    createdDate: {
        type: Number,
        autoValue: function() {
            if (this.isUpdate) {
              return new Date().getTime();
            }
          },
        optional: true,
        denyUpdate: true
    },
    proposedDate1: {
        type: Number,
        denyUpdate: true
    },
    proposedDate2: {
        type: Number,
        denyUpdate: true
    },
    finalSelected:{
        type: Number,
        optional: true
    }
});


Movie.attachSchema(Schemas.Movie);


if (Meteor.isServer) {
    //Liste paginée des films


    
}