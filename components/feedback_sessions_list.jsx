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
    var currentUser = Employees.findOne(); // Temp...need a current user

    Meteor.call('newFeedbackSession', currentUser, function(error, result) {
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
    'newFeedbackSession': function(currentUser) {
      var teamEmployeeIds = [];
      var otherEmployeeIds = [];

      Employees.find().fetch().map(function(employee) {
        if(employee._id !== currentUser._id){
          if(employee.team === currentUser.team) {
            return teamEmployeeIds.push(employee._id);
          } else {
            return otherEmployeeIds.push(employee._id);
          }
        }
      });

      return FeedbackSessions.insert({
        employees: _.take(_.shuffle(teamEmployeeIds), 4).concat(_.take(_.shuffle(otherEmployeeIds), 1))
      });
    },

    'deleteAllFeedbackSessions': function() {
      FeedbackSessions.remove({});
    }
  });
}
