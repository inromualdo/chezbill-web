import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

var Dropbox, Request, bound, client, fs = {};

if (Meteor.isServer) {
  Dropbox = require('dropbox').Dropbox;
  Request = Npm.require('request');
  fs = Npm.require('fs');
  require('isomorphic-fetch');
  bound = Meteor.bindEnvironment(function(callback) {
    return callback();
  });
  client = new Dropbox({
    key: '9oo59540lon4ezs',
    secret: 'x5lo2tjs1tx2rz0',
    accessToken: 'PUx_fxHBb3AAAAAAAAAB2zUY5TlaVEEoZ9qk8BOj32Onzhx7NdBDtMwHJe_luUa3'
  });
}
 
// Image component - represente une image
export default Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Désactiver la posibilité de supprimer des images sur le client.
  storagePath: 'assets/app/uploads/uploadedFiles',
  onBeforeUpload(file) {
    // Permettre uniquement des chargement en dessous de 10MB, et seulement dans les formats png/jpg/jpeg.
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
  onAfterUpload: function(fileRef) {
    // In onAfterUpload callback we will move file to DropBox
    var self = this;
    var makeUrl = function(stat, fileRef, version, triesUrl) {
      if (triesUrl == null) {
        triesUrl = 0;
      }
      client.sharingCreateSharedLink({
        path: stat.path_display,
        short_url: false
      }).then(xml=>{
        bound(function() {
          if (xml) {
            var upd = {
              $set: {}
            };
            upd['$set']["versions." + version + ".meta.pipeFrom"] = xml.url;
            upd['$set']["versions." + version + ".meta.pipePath"] = stat.path_display;
            self.collection.update({
              _id: fileRef._id
            }, upd, function(error) {
              if (error) {
                console.error(error);
              } else {
                // Unlink original files from FS
                // after successful upload to DropBox
                self.unlink(self.collection.findOne(fileRef._id), version);
              }
            });
          } else {
            if (triesUrl < 10) {
              Meteor.setTimeout(function() {
                makeUrl(stat, fileRef, version, ++triesUrl);
              }, 2048);
            } else {
              console.error("client.makeUrl doesn't returns xml", {
                triesUrl: triesUrl
              });
            }
          }
        });
      }).catch(error=>{
        bound(function() {
          if (error) {
            if (triesUrl < 10) {
              Meteor.setTimeout(function() {
                makeUrl(stat, fileRef, version, ++triesUrl);
              }, 2048);
            } else {
              console.error(error, {
                triesUrl: triesUrl
              });
            }
          }
        })
      });
    };

    var writeToDB = function(fileRef, version, data, triesSend) {
      // DropBox already uses random URLs
      // No need to use random file names
      if (triesSend == null) {
        triesSend = 0;
      }
      
      client.filesUpload(
        {
          path: "/" + fileRef._id.toLowerCase() + "_" + version + "." + fileRef.extension, 
          contents: data
        }
      ).then(response => {
        bound(function() {
          makeUrl(response, fileRef, version);
        })
      }).catch(function(error) {
        bound(function() {
        if (triesSend < 10) {
          Meteor.setTimeout(function() {
            writeToDB(fileRef, version, data, ++triesSend);
          }, 2048);
        } else {
          console.error(error, {
            triesSend: triesSend
          });
        }
        })
      });
    };

    var readFile = function(fileRef, vRef, version, triesRead) {
      if (triesRead == null) {
        triesRead = 0;
      }
      console.log(vRef.path);
      fs.readFile(vRef.path, function(error, data) {
        bound(function() {
          if (error) {
            if (triesRead < 10) {
              readFile(fileRef, vRef, version, ++triesRead);
            } else {
              console.error(error);
            }
          } else {
            writeToDB(fileRef, version, data);
          }
        });
      });
    };

    var sendToStorage = function(fileRef) {
      _.each(fileRef.versions, function(vRef, version) {
        readFile(fileRef, vRef, version);
      });
    };

    sendToStorage(fileRef);
  },
  interceptDownload: function(http, fileRef, version) {
    var path, ref, ref1, ref2;

    path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
    if (path) {
      // If file is moved to DropBox
      // We will pipe request to DropBox
      // So, original link will stay always secure
      this.serve(http, fileRef, fileRef.versions[version], version, Request({
        url: path,
        headers: _.pick(http.request.headers, 'range', 'cache-control', 'connection')
      }));
      return true;
    } else {
      // While file is not yet uploaded to DropBox
      // We will serve file from FS
      return false;
    }
  }
});

if (Meteor.isServer) {
  // Intercept File's collection remove method
  // to remove file from DropBox
  var _origRemove = Images.remove;

  Images.remove = function(search) {
    var cursor = this.collection.find(search);
    cursor.forEach(function(fileRef) {
      _.each(fileRef.versions, function(vRef) {
        var ref;
        if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
          client.remove(vRef.meta.pipePath, function(error) {
            bound(function() {
              if (error) {
                console.error(error);
              }
            });
          });
        }
      });
    });
    // Call original method
    _origRemove.call(this, search);
  };
}