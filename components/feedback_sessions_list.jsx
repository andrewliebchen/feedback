/**
 * @jsx React.DOM
 */

FeedbackSessionsList = React.createClass({
  handleDeleteAllFeedbackSessions() {
    if(window.confirm('Are you sure you want to delete all sessions?')) {
      Meteor.call('deleteAllFeedbackSessions');
    }
  },

  handleCreateFeedbackSession() {
    Meteor.call('createFeedbackSessions');
  },

  render() {
    return (
      <section className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Feedback Sessions</h3>
        </header>
        <table className="table">
          <tbody>
            {this.props.feedbackSessions.map((session, i) =>{
              return (
                <tr key={i}>
                  <td><a href={`/feedback/${session._id}`}>Session</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <footer className="panel-footer">
          <button className="btn btn-danger" onClick={this.handleDeleteAllFeedbackSessions}>
            Delete all
          </button>
          <button className="btn btn-primary" onClick={this.handleCreateFeedbackSession}>
            Add feedback sessions
          </button>
        </footer>
      </section>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'createFeedbackSessions': function() {
      function createFeedbackSession(employees, currentEmployee) {
        var teamEmployeeIds = [];
        var otherEmployeeIds = [];

        // For each employee, create a feedback session
        employees.map(function(employee) {
          if(employee._id !== currentEmployee._id) {
            if(employee.team === currentEmployee.team) {
              return teamEmployeeIds.push(employee._id);
            } else {
              return otherEmployeeIds.push(employee._id);
            }
          }
        });

        return FeedbackSessions.insert({
          employees: _.take(_.shuffle(teamEmployeeIds), 4).concat(_.take(_.shuffle(otherEmployeeIds), 1))
        });
      }

      var employees = Employees.find().fetch();

      employees.map(function(employee) {
        createFeedbackSession(employees, employee);
      });
    },

    'deleteAllFeedbackSessions': function() {
      FeedbackSessions.remove({});
    }
  });
}
