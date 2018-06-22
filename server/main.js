import { Meteor } from 'meteor/meteor';
import Image from '../imports/model/Image';
import createThumbnails from './image_thumbnails';
import { saveMovie } from '../imports/api/saveMovie';
import { getMovie } from '../imports/api/getMovie';
import '../imports/api/publishMovies';
import { saveProposition } from '../imports/api/saveProposition';

Meteor.startup(() => {
  // code to run on server at startup
});
