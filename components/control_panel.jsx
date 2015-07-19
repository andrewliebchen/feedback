/**
 * @jsx React.DOM
 */

var _ = lodash;

ControlPanel = ReactMeteor.createClass({
  getMeteorState() {
    return {
      employees: this.getEmployees(),
      organization: this.getOrganization(),
      feedbackSessions: this.getFeedbackSessions()
    };
  },

  getEmployees() {
    if(FlowRouter.subsReady('employees')) {
      return Meteor.users.find().fetch();
    } else {
      return [];
    }
  },

  getOrganization() {
    if(FlowRouter.subsReady('employees')) {
      return Organizations.findOne();
    } else {
      return [];
    }
  },

  getFeedbackSessions() {
    if(FlowRouter.subsReady('feedbackSessions')) {
      return FeedbackSessions.find().fetch();
    } else {
      return [];
    }
  },

  render() {
    return (
      <div className="container">
        <Header/>
        <EmployeesList
          employees={this.state.employees}
          organization={this.state.organization}/>
        <FeedbackSessionsList
          feedbackSessions={this.state.feedbackSessions}
          employees={this.state.employees}/>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/', {
    subscriptions: function(params) {
      this.register('employees', Meteor.subscribe('employees'));
      this.register('feedbackSessions', Meteor.subscribe('feedbackSessions'));
    },

    action: function(param) {
      $(document).ready(function() {
        React.render(<ControlPanel/>, document.getElementById('yield'));
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('employees', function() {
    var currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
    return [
      Meteor.users.find({'profile.organization': currentOrgId}),
      Organizations.find({_id: currentOrgId})
    ];
  });

  Meteor.publish('feedbackSessions', function() {
    var currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
    return FeedbackSessions.find({'organization': currentOrgId});
  });
}
