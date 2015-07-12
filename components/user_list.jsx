/**
 * @jsx React.DOM
 */

var _ = lodash;

UserList = ReactMeteor.createClass({

  getMeteorState() {
    return {
      employees: Employees.find().fetch(),
      feedbackSessions: FeedbackSessions.find().fetch()
    };
  },

  handleCreateFeedbackSession() {
    var employeeIds = this.state.employees.map(function(employee) {
      return employee._id
    });
    Meteor.call('newFeedbackSession', {
      employees: _.take(_.shuffle(employeeIds), 5)
    }, function(error, result) {
      FlowRouter.go(`/feedback/${result}`);
    });
  },

  renderEmployeeRow(employee, key) {
    return (
      <tr key={key}>
        <td>{`${employee.name.first} ${employee.name.last}`}</td>
        {employee.feedback ?
          <td>
            {employee.feedback.map((feedback, i) => {
              return <span key={i}>{feedback.response === 'positive' ? "👍" : "👎"}</span>;
            })}
          </td>
        : null}
      </tr>
    );
  },

  render() {
    return (
      <div className="wrapper">
        <Header/>
        <h2>Employees</h2>
        <table>
          <tbody>
            {this.state.employees.map((employee, i) => {
              return this.renderEmployeeRow(employee, i);
            })}
          </tbody>
        </table>

        <h2>Feedback Sessions</h2>
        {this.state.feedbackSessions.map((session, i) =>{
          return (
            <div key={i}>
              <a href={`/feedback/${session._id}`}>Session</a>
            </div>
          );
        })}
        <button onClick={this.handleCreateFeedbackSession}>
          New feedback session
        </button>
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
        React.render(<UserList/>, document.getElementById('yield'));
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

  Meteor.methods({
    'newFeedbackSession': function(employees) {
      return FeedbackSessions.insert(employees);
    }
  });
}
