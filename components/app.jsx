/**
 * @jsx React.DOM
 */

const cx = React.addons.classSet;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

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
    let columnsClassName = cx({
      "columns": true,
      "show-sidebar": this.state.sidebar
    });

    return (
      <div className={columnsClassName}>
        <OrganizationRow
          organization={this.data.organization}
          editOrganization={this.handleEditOrganization}
          canEdit={canEdit}
          showDetail={this.handleShowDetail}/>
        <EmployeesList
          employees={this.data.employees}
          organization={this.data.organization}
          showDetail={this.handleShowDetail}/>
        <a className="sidebar__toggle block-link" onClick={this.handleSidebarToggle}>
          {this.state.sidebar ? '⇥' : '⇤'}
        </a>
        {this.state.sidebar ?
          <Sidebar/>
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
