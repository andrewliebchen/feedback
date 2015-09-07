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
    let modal = FlowRouter.getQueryParam('show') ? FlowRouter.getQueryParam('show') : false;
    return {
      modal: modal
    };
  },

  handleShowDetail(id) {
    if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      FlowRouter.setQueryParams({
        show: id
      });
      this.setState({modal: true});
    }
  },

  handleCloseModal() {
    FlowRouter.setQueryParams({
      show: null
    });
    this.setState({modal: false});
  },

  render() {
    return (
      <section className="dashboard container_wide">
        <Header session/>
        <Row
          id={this.data.organization._id}
          name={this.data.organization.name}
          image={this.data.organization.imageSrc}
          showDetail={this.handleShowDetail}/>
        {this.data.employees.map((employee, i) => {
          return (
            <Row
              key={i}
              id={employee._id}
              name={employee.profile.name}
              image={employee.profile.imageSrc}
              feedbacks={employee.profile.feedbacks}
              showDetail={this.handleShowDetail}/>
          );
        })}
        {/*<AddEmployee/>*/}

        {this.state.modal ?
          <Modal close={this.handleCloseModal}/>
        : null}
      </section>
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
          ReactLayout.render(App);
        });
      // } else {
      //   FlowRouter.go('/login');
      // }
    }
  });
}
