/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeesList = React.createClass({
  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    return (
      <section className="employees-list">
        {this.props.employees.map((employee, i) => {
          return <EmployeeRow key={i} employee={employee} organization={this.props.organization}/>;
        })}
      </section>
    );
  }
});
