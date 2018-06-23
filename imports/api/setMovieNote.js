import { Note } from '../model/Note';

Meteor.method("add-movie-note", function (movieId, email, note) {

    const exist= Note.findOne({
        movieId,
        email
    });

    if(exist){
        this.setHttpStatusCode(400);
        throw new Meteor.Error(400,"Exist");
    }
    
    const id= Note.insert({
        movieId,
        email,
        note
    });

    this.setHttpStatusCode(200);

    return id;
  }, {
    url: "add-movie-note",
    getArgsFromRequest: function (request) {
      var content = request.body;
      return [ content.movieId, content.email, parseInt(content.note, 128) ];
    }
  })