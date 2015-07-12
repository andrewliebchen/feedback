/**
 * @jsx React.DOM
 */

FeedbackSessionsList = React.createClass({
  handleCreateFeedbackSession() {
    var employeeIds = this.props.employees.map(function(employee) {
      return employee._id
    });
    Meteor.call('newFeedbackSession', {
      employees: _.take(_.shuffle(employeeIds), 5)
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
