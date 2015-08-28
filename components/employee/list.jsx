/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeesList = React.createClass({
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
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    return (
      <section className="employees-list">
        {this.props.employees.map((employee, i) => {
          return <EmployeeRow key={i} employee={employee} organization={this.props.organization}/>;
        })}
        <button className="btn btn-default"
          onClick={this.handleAddSeedEmployee}>
          New seed employee
        </button>
        <button className="btn btn-default"
          onClick={this.toggleNewEmployee}>
          New employee
        </button>
      </section>
    );
  }
});
