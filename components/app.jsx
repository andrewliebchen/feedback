/**
 * @jsx React.DOM
 */

const cx = React.addons.classSet;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

const AddEmployee = React.createClass({
  handleAddSeedEmployee() {
    $.ajax({
      url: 'http://api.randomuser.me/',
      dataType: 'json',
      success: (data) => {
        let randomUser = data.results[0].user;
        let newEmployee = {
          username: randomUser.username,
          email: randomUser.email,
          password: randomUser.password,
          organization: Meteor.user().profile.organization,
          name: `${randomUser.name.first} ${randomUser.name.last}`,
          imageSrc: randomUser.picture.large,
          teams: ['Team 1']
        };

        Meteor.call('newEmployee', newEmployee);
      }
    });
  },

  toggleNewEmployee() {
    FlowRouter.setQueryParams({
      show: 'new_employee'
    });
  },

  render() {
    return (
      <div className="add-employee">
        <button className="btn btn-default"
          onClick={this.handleAddSeedEmployee}>
          + Seed
        </button>
        <button className="btn btn-default"
          onClick={this.toggleNewEmployee}>
          + Employee
        </button>
      </div>
    );
  }
});

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
        <section className="employees">
          {this.data.employees.map((employee, i) => {
            return (
              <EmployeeRow
                key={i}
                employee={employee}
                organization={this.data.organization}
                showDetail={this.handleShowDetail}/>
            );
          })}
          <AddEmployee/>
        </section>
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
          ReactLayout.render(LayoutWide, {
            content: <App/>
          });
        });
      // } else {
      //   FlowRouter.go('/login');
      // }
    }
  });
}
