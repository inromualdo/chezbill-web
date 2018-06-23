import {
    Movie
} from '../model/Movie';


Meteor.publish('api-last-movie', function() {
     //Date de référence
     const referenceDate= new Date().getTime();

     /**
      * Liste les films dans l'ordre croissant des dates (Nous recherchons celui qui a la plus grande date)
      */
     const movie= Movie.find({
             finalSelected: {
                 "$lt": referenceDate
             }
         },
         {
             sort: {
                 finalSelected: 1
             },
             limit: 1
         }
     )

     return movie;
}, {
    url: "get-last-movie",
    httpMethod: "get"
});