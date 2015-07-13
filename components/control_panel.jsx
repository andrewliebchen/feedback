/**
 * @jsx React.DOM
 */

var _ = lodash;

ControlPanel = ReactMeteor.createClass({
  getMeteorState() {
    return {
      currentOrganization: Organizations.findOne(),
      employees: Meteor.users.find().fetch(),
      feedbackSessions: FeedbackSessions.find().fetch()
    };
  },

  handleChangeOrganization(event) {
    console.log(event.target.value);
  },

  render() {
    return (
      <div className="container">
        <Header
          currentOrganization={this.state.currentOrganization}
          changeOrganization={this.handleChangeOrganization}/>
        <EmployeesList
          employees={this.state.employees}
          currentOrganization={this.state.currentOrganization}/>
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
      this.register('currentOrganization', Meteor.subscribe('currentOrganization'));
      this.register('employees', Meteor.subscribe('employees'));
      this.register('feedbackSessions', Meteor.subscribe('feedbackSessions'));
    },

    action: function(param) {
      $(document).ready(function(){
        React.render(<ControlPanel/>, document.getElementById('yield'));
      });
    }
  });
}

if(Meteor.isServer) {
  // Once there's a current user, query that user and return only her organziation
  Meteor.publish('currentOrganization', function() {
    return Organizations.find();
  });

  Meteor.publish('employees', function(currentOrganizationId) {
    return Meteor.users.find();
  });

  Meteor.publish('feedbackSessions', function() {
    return FeedbackSessions.find();
  });
}
