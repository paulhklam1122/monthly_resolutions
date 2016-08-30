import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Resolutions = new Mongo.Collection('resolutions');
  // code to run on server at startup
});

Meteor.publish("resolutions", function(){
  return Resolutions.find({
    $or: [
      {private: {$ne: true}},
      {owner: this.userId}
    ]
  });
});

Meteor.methods({
  addResolution: function(title) {
    Resolutions.insert({
      title: title,
      createdAt: new Date(),
      owner: Meteor.userId()
    });
  },
  deleteResolution: function(id) {
    var resolution = Resolutions.findOne(id);
    if (resolution.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.remove(id);
  },
  updateResolution: function(id, checked) {
    var resolution = Resolutions.findOne(id);
    if (resolution.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.update(id, {$set: {checked: checked}})
  },
  setPrivate: function(id, private) {
    var resolution = Resolutions.findOne(id);
    if (resolution.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    } else {
      Resolutions.update(id, {$set: {private: private}})
    }
  }
});
