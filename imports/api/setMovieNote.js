import { Note } from '../model/Note';

Meteor.method("add-movie-note", function (movieId, email, note) {

    const exist= Note.findOne({
        movieId,
        email
    });

    var sendId= movieId

    if(exist){
        this.setHttpStatusCode(400);
    }else{

        const id= Note.insert({
            movieId,
            email,
            note
        });
    
        if(id){
            this.setHttpStatusCode(200);
            sendId= id
        }

    }

    return sendId;
  }, {
    url: "add-movie-note",
    getArgsFromRequest: function (request) {
      var content = request.body;
      return [ content.movieId, content.email, Number(content.note) ];
    }
  })