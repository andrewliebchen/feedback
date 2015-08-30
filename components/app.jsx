/**
 * @jsx React.DOM
 */

const cx = React.addons.classSet;

App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employees: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
      organization: Organizations.findOne()
    };
  },

  getInitialState() {
    return {
      sidebar: true
    };
  },

  renderSidebarContent() {
    let type = FlowRouter.getQueryParam('show');
    let id = FlowRouter.getQueryParam('id');

    switch(type) {
      case 'employee':
        return <EmployeeProfile id={id}/>;

      case 'new_employee':
        return <NewEmployeeForm organization={Organizations.findOne()} teams={Teams.find().fetch()}/>;

      case 'email_invite':
        return <EmailInvite organization={Organizations.findOne()}/>;

      default:
        return <OrganizationProfile/>;
    }
  },

  handleSidebarToggle() {
    this.setState({sidebar: !this.state.sidebar});
  },

  handleShowDetail(show, id) {
    this.setState({sidebar: true});
    FlowRouter.setQueryParams({
      show: show,
      id: id
    });
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    // Do the sidebar placeholder with CSS instead...
    return (
      <div>
        <OrganizationRow
          organization={this.data.organization}
          editOrganization={this.handleEditOrganization}
          canEdit={canEdit}
          showDetail={this.handleShowDetail}
          sidebar={this.state.sidebar}/>
        <EmployeesList
          employees={this.data.employees}
          organization={this.data.organization}
          showDetail={this.handleShowDetail}
          sidebar={this.state.sidebar}/>
        <a className="sidebar__toggle block-link" onClick={this.handleSidebarToggle}>
          {this.props.show ? '⇥' : '⇤'}
        </a>
        {this.state.sidebar ?
          <Sidebar>
            {this.renderSidebarContent()}
          </Sidebar>
        : null}
        <Background sidebar={this.state.sidebar}/>
        <BackgroundLabels sidebar={this.state.sidebar}/>
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
