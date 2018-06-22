import {
  FlowRouter
} from 'meteor/ostrio:flow-router-extra';
import {
  mount
} from 'react-mounter';
import React from 'react';

import App from '../imports/ui/App';
import ListMovies from '../imports/ui/ListMovies';
import NewMovie from '../imports/ui/NewMovie';
import MovieProposed from '../imports/ui/MovieProposed';


FlowRouter.route("/", {
  triggersEnter: [function (context, redirect) {
    redirect('/film');
  }]
});

FlowRouter.route("/film", {
  action: function () {
    mount(App, {
      content: <ListMovies / >
    });
  }
});

FlowRouter.route("/film/:_id", {
  name: 'film',
  action: function () {
    mount(App, {
      content: < MovieProposed / >
    });
  }
});