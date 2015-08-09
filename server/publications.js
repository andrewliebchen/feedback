Meteor.publish(null, function (){
  return Meteor.roles.find({})
});

Meteor.publish('controlPanel', function() {
  var currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
  return [
    Meteor.users.find({'profile.organization': currentOrgId}),
    Organizations.find({_id: currentOrgId}),
    FeedbackSessions.find({'organization': currentOrgId})
  ];
});

Meteor.publish('registration', function(id) {
  return Organizations.find({_id: id});
});

Meteor.publish('organization', function() {
  var currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
  return Organizations.find({_id: currentOrgId});
});

Meteor.publish('feedbackSession', function(id){
  var feedbackSession = FeedbackSessions.findOne(id);
  var respondant = feedbackSession.respondant;
  if(Roles.userIsInRole(this.userId, ['admin']) || this.userId === respondant) {
    return [
      FeedbackSessions.find(id),
      Meteor.users.find({
        _id: {$in: FeedbackSessions.findOne(id).employees}
      })
    ];
  }
});

Meteor.publish('employeeProfile', function(id) {
  if(Roles.userIsInRole(this.userId, ['admin']) || this.userId === id) {
    return Meteor.users.find(id);
  }
});

Meteor.publish('newEmployee', function(id) {
  return Organizations.find({_id: id});
});
