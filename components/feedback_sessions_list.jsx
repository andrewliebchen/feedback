/**
 * @jsx React.DOM
 */

FeedbackSessionsList = React.createClass({
  handleCreateFeedbackSession() {
    var currentUserTeam = 'team 1'; // Temp...need a current user
    var teamEmployeeIds = [];
    var otherEmployeeIds = [];
    this.props.employees.map(function(employee) {
      if(employee.team === 'team 1') {
        return teamEmployeeIds.push(employee._id);
      } else {
        return otherEmployeeIds.push(employee._id);
      }
    });
    var feedbackGroup = _.take(_.shuffle(teamEmployeeIds), 4).concat(_.take(_.shuffle(otherEmployeeIds), 1));

    Meteor.call('newFeedbackSession', {
      employees: feedbackGroup
    }, function(error, result) {
      FlowRouter.go(`/feedback/${result}`);
    });
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
          <button className="btn btn-primary" onClick={this.handleCreateFeedbackSession}>
            New feedback session
          </button>
        </footer>
      </section>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'newFeedbackSession': function(employees) {
      return FeedbackSessions.insert(employees);
    }
  });
}
