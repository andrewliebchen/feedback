/**
 * @jsx React.DOM
 */

const _ = lodash;

ControlPanel = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employees: this.getEmployees(),
      organization: this.getOrganization(),
      feedbackSessions: this.getFeedbackSessions()
    };
  },

  getEmployees() {
    if(FlowRouter.subsReady('employees')) {
      return Meteor.users.find().fetch();
    } else {
      return [];
    }
  },

  getOrganization() {
    if(FlowRouter.subsReady('organization')) {
      return Organizations.findOne();
    } else {
      return [];
    }
  },

  getFeedbackSessions() {
    if(FlowRouter.subsReady('feedbackSessions')) {
      return FeedbackSessions.find().fetch();
    } else {
      return [];
    }
  },

  render() {
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
                  <a
                    className="btn btn-default btn-sm pull-right"
                    href="/organization">
                    Edit
                  </a>
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
      this.register('employees', Meteor.subscribe('employees'));
      this.register('organization', Meteor.subscribe('organization'));
      this.register('feedbackSessions', Meteor.subscribe('feedbackSessions'));
    },

    action: function(param) {
      ReactLayout.render(Layout, {
        content: <ControlPanel/>
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('employees', function() {
    let currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
    return Meteor.users.find({'profile.organization': currentOrgId});
  });

  Meteor.publish('organization', function() {
    let currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
    return Organizations.find({_id: currentOrgId});
  });

  Meteor.publish('feedbackSessions', function() {
    let currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
    return FeedbackSessions.find({'organization': currentOrgId});
  });
}
