/**
 * @jsx React.DOM
 */

const _ = lodash;

FeedbackSessionsList = React.createClass({
  handleDeleteAllFeedbackSessions() {
    if(window.confirm('Are you sure you want to delete all sessions?')) {
      Meteor.call('deleteAllFeedbackSessions');
    }
  },

  handleCreateFeedbackSession() {
    Meteor.call('createFeedbackSessions');
  },

  renderEmployee(respondent) {
    let employee = _.find(this.props.employees, {_id: respondent});
    console.log(employee);
    return <Avatar employee={employee}/>;
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    return (
      <div className="panel__body">
        <table className="table">
          <tbody>
            {this.props.feedbackSessions.map((session, i) =>{
              return (
                <tr key={i}>
                  <td>{this.renderEmployee(session.for)}</td>
                  <td>{`${session.month}/${session.year}`}</td>
                  <td>{session.complete ? '✅' : '⏳'}</td>
                  <td>
                    <a href={`/feedbacks/${session._id}`} className="btn btn-default btn-sm">View</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {canEdit ?
          <footer className="panel__footer">
            <button className="btn btn-danger" onClick={this.handleDeleteAllFeedbackSessions}>
              Delete all
            </button>
            <button className="btn btn-primary" onClick={this.handleCreateFeedbackSession}>
              Add feedback sessions
            </button>
          </footer>
        : null}
      </div>
    );
  }
});

if(Meteor.isServer) {
  Meteor.startup(function(){
    if(this.userId){
      Meteor.call('scheduleFeedbackSessions');
    }
  });

  Meteor.methods({
    'createFeedbackSessions': function() {
      let employees = Meteor.users.find().fetch();
      let month = _.random(1, 12); // For the current month...`moment().format('M')`

      employees.map(function(employee) {
        createFeedbackSession(employees, employee, month);
      });
    },

    'scheduleFeedbackSessions': function() {
      // Feedback CRON job
      const currentOrgId = Meteor.users.findOne(Meteor.userId).profile.organization;
      const currentOrgFeedback = Organizations.findOne(currentOrgId).feedback;
      SyncedCron.stop();

      SyncedCron.add({
        name: 'Build feedback sessions',
        schedule: function(parser) {
          if(currentOrgFeedback.frequency === 'Monthly'){
            return parser.text('on the first day of the month at 8:00 am');
          } else {
            return parser.text('at 8:00 am on Monday');
          }
        },

        job: function() {
          Meteor.call('createFeedbackSessions');
        }
      });

      currentOrgFeedback.status ? SyncedCron.start() : SyncedCron.stop();
    },

    'deleteAllFeedbackSessions': function() {
      FeedbackSessions.remove({});
    }
  });
}
