import SimpleSchema from 'simpl-schema';
export const Note = new Mongo.Collection('notes');

const Schemas = {};

Schemas.Note = new SimpleSchema({
    movieId: String,
    email: String,
    note: Number,
    createdDate: {
        type: Number,
        autoValue: function() {
            if (this.isInsert) {
              return new Date().getTime();
            }
          },
        optional: true,
        denyUpdate: true
    }
});


Note.attachSchema(Schemas.Note);