/**
 * @jsx React.DOM
 */

ControlPanel = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employees: Meteor.users.find().fetch(),
      organization: Organizations.findOne(),
      feedbackSessions: FeedbackSessions.find().fetch()
    };
  },

  handleEditOrganization() {
    FlowRouter.setQueryParams({
      show: 'organization',
      id: this.data.organization._id
    });
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    return (
      <div className="admin-wrapper">
        <OrganizationRow
          organization={this.data.organization}
          editOrganization={this.handleEditOrganization}
          canEdit={canEdit}/>
        <EmployeesList
          employees={this.data.employees}
          organization={this.data.organization}/>
        {/*<FeedbackSessionsList
          feedbackSessions={this.data.feedbackSessions}
          employees={this.data.employees}/>*/}
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/', {
    subscriptions: function(params) {
      this.register('controlPanel', Meteor.subscribe('controlPanel'));
    },

    action: function(param) {
      // if(Meteor.user()) {
        FlowRouter.subsReady('controlPanel', function() {
          ReactLayout.render(Layout, {
            content: <ControlPanel/>
          });
        });
      // } else {
      //   FlowRouter.go('/login');
      // }
    }
  });
}
