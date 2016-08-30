import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Resolutions = new Mongo.Collection('resolutions');

Meteor.subscribe("resolutions");

Template.body.helpers({
  resolutions: function(){
    if (Session.get('hideFinished') === true) {
      return Resolutions.find({checked: {$ne: true}});
    } else {
      return Resolutions.find();
    }
  },
  hideFinished: function(){
    return Session.get('hideFinished')
  }
});

Template.body.events({
  'submit .new-resolution': function(event){
    event.preventDefault();
    var title = event.target.title.value;

    Meteor.call("addResolution", title);

    event.target.title.value = '';
  },
  'change .hide-finished': function(event){
    Session.set('hideFinished', event.target.checked)
  }
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
    if (resolution.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Resolutions.remove(id);
  },
  updateResolution: function(id, checked) {
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
