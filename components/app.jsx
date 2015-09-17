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
        <Header addEmployee={this.handleShowDetail}/>
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
