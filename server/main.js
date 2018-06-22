import { Meteor } from 'meteor/meteor';
import Image from '../imports/model/Image';
import { saveMovie } from '../imports/api/saveMovie';
import { getMovie } from '../imports/api/getMovie';
import '../imports/api/publishMovies';
import { saveProposition } from '../imports/api/saveProposition';


import { Accounts } from 'meteor/accounts-base'


Meteor.startup(() => {
  // Créer l'utilisateur administrateur
  const adminUser= {
    username: "admin",
    email: "inromualdo@gmail.com",
    password: "admiN23@"
  }

  const admin= Accounts.findUserByUsername(adminUser.username);

  if(!admin){
    Accounts.createUser(adminUser)
  }
  
});
