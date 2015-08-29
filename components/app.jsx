/**
 * @jsx React.DOM
 */

App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employees: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
      organization: Organizations.findOne()
    };
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    return (
      <div>
        <OrganizationRow
          organization={this.data.organization}
          editOrganization={this.handleEditOrganization}
          canEdit={canEdit}/>
        <EmployeesList
          employees={this.data.employees}
          organization={this.data.organization}/>
        <Background/>
        <BackgroundLabels/>
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
            content: <App/>
          });
        });
      // } else {
      //   FlowRouter.go('/login');
      // }
    }
  });
}
