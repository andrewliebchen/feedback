/**
 * @jsx React.DOM
 */

 var _ = lodash;

FeedbackSessionsList = React.createClass({
  handleDeleteAllFeedbackSessions() {
    if(window.confirm('Are you sure you want to delete all sessions?')) {
      Meteor.call('deleteAllFeedbackSessions');
    }
  },

  handleCreateFeedbackSession() {
    Meteor.call('createFeedbackSessions');
  },

  renderEmployee(respondant) {
    var employee = _.find(this.props.employees, {_id: respondant});
    return <Avatar employee={employee.profile}/>;
  },

  render() {
    return (
      <section className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Feedback Sessions</h3>
        </header>
        <table className="table">
          <thead>
            <th>Feedback session respondant</th>
            <th>Period</th>
            <th/>
          </thead>
          <tbody>
            {this.props.feedbackSessions.map((session, i) =>{
              return (
                <tr key={i}>
                  <td>{this.renderEmployee(session.respondant)}</td>
                  <td>{session.period}</td>
                  <td>
                    <a href={`/feedback/${session._id}`} className="btn btn-default btn-sm">View</a>
                  </td>
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
            if(employee.profile.team === currentEmployee.profile.team) {
              return teamEmployeeIds.push(employee._id);
            } else {
              return otherEmployeeIds.push(employee._id);
            }
          }
        });

        return FeedbackSessions.insert({
          respondant: currentEmployee._id,
          employees: _.take(_.shuffle(teamEmployeeIds), 4).concat(_.take(_.shuffle(otherEmployeeIds), 1)),
          period: moment().format('M')
        });
      }

      var employees = Meteor.users.find().fetch();

      employees.map(function(employee) {
        createFeedbackSession(employees, employee);
      });
    },

    'deleteAllFeedbackSessions': function() {
      FeedbackSessions.remove({});
    }
  });
}
