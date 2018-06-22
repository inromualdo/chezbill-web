import { publishComposite } from 'meteor/reywood:publish-composite';
import Image from '../model/Image';
import {Movie} from '../model/Movie';

const PER_PAGE= 5

publishComposite('listOfMovies', function(page) {
    
    Counts.publish(this, 'listOfMovies-nb', Movie.find(), { noReady: true });

    return {
        find() {
            // Retrouver la liste des films
            return Movie.find({}, { limit: PER_PAGE, skip:  page * PER_PAGE});
        },
        children: [
            {
                //Retrouver pour chaque film son image
                find(movie) {
                    return Image.find({"meta.movieId": movie._id}).cursor;
                }
            }
        ]
    }
});