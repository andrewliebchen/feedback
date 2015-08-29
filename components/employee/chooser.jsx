/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeeChooser = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    Meteor.subscribe('employees');

    return {
      employees: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch()
    }
  },

  render() {
    return (
      <div className="employee-chooser">
        {this.data.employees.map((employee, i) => {
          return (
            <li onClick={this.props.handleSelectEmployee.bind(null, employee._id)}>
              <div className="avatar media">
                {employee.profile.imageSrc ?
                  <div className="media-left">
                    <img src={employee.profile.imageSrc} className="img-rounded" width="24"/>
                  </div>
                : null}
                <div className="media-body">{_.capitalize(employee.profile.name)}</div>
              </div>
            </li>
          )
        })}
      </div>
    );
  }
});
