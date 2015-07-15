/**
 * @jsx React.DOM
 */

var _ = lodash;

ControlPanel = ReactMeteor.createClass({
  getMeteorState() {
    return {
      employees: Meteor.users.find().fetch(),
      feedbackSessions: FeedbackSessions.find().fetch()
    };
  },

  render() {
    return (
      <div className="container">
        {Meteor.user() ?
          <span>
            <Header/>
            <EmployeesList
              employees={this.state.employees}
              currentOrganization={Meteor.user().profile.organization}/>
            <FeedbackSessionsList
              feedbackSessions={this.state.feedbackSessions}
              employees={this.state.employees}/>
          </span>
        : <Login/>}
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/', {
    subscriptions: function(params) {
      this.register('employees', Meteor.subscribe('employees', Meteor.userId()));
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
  Meteor.publish('employees', function(currentOrganizationId) {
    return Meteor.users.find({'profile.organization': currentOrganizationId});
  });

  Meteor.publish('feedbackSessions', function(currentOrganizationId) {
    return FeedbackSessions.find({'organization': currentOrganizationId});
  });
}
