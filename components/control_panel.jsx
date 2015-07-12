/**
 * @jsx React.DOM
 */

var _ = lodash;

ControlPanel = ReactMeteor.createClass({
  getMeteorState() {
    return {
      employees: Employees.find().fetch(),
      feedbackSessions: FeedbackSessions.find().fetch()
    };
  },

  render() {
    return (
      <div className="container">
        <Header/>
        <EmployeesList employees={this.state.employees}/>
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
      $(document).ready(function(){
        React.render(<ControlPanel/>, document.getElementById('yield'));
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('employees', function() {
    return Employees.find();
  });

  Meteor.publish('feedbackSessions', function() {
    return FeedbackSessions.find();
  });
}
