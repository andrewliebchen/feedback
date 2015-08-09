/**
 * @jsx React.DOM
 */

const _ = lodash;

ControlPanel = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employees: Meteor.users.find().fetch(),
      organization: Organizations.findOne(),
      feedbackSessions: FeedbackSessions.find().fetch()
    };
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    return (
      <div>
        <div className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">Organization</h3>
          </header>
          <table className="table">
            <tbody>
              <tr>
                <td>{this.data.organization.name}</td>
                <td>
                  {canEdit ?
                    <a
                      className="btn btn-default btn-sm pull-right"
                      href="/organization">
                      Edit
                    </a>
                  : null}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmployeesList
          employees={this.data.employees}
          organization={this.data.organization}/>
        <FeedbackSessionsList
          feedbackSessions={this.data.feedbackSessions}
          employees={this.data.employees}/>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/admin', {
    subscriptions: function(params) {
      this.register('controlPanel', Meteor.subscribe('controlPanel'));
    },

    action: function(param) {
      FlowRouter.subsReady('controlPanel', function() {
        ReactLayout.render(Layout, {
          content: <ControlPanel/>
        });
      });
    }
  });
}
