/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeeChooser = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    selectEmployee: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired
  },

  getMeteorData() {
    Meteor.subscribe('employees');

    return {
      employees: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch()
    }
  },

  render() {
    return (
      <span>
        <div className="employee-chooser menu">
          {this.data.employees.map((employee, i) => {
            return (
              <div className="menu__item" onClick={this.props.selectEmployee.bind(null, employee._id)}>
                <div className="avatar media">
                  {employee.profile.imageSrc ?
                    <div className="media-left">
                      <img src={employee.profile.imageSrc} className="img-rounded" width="24"/>
                    </div>
                  : null}
                  <div className="media-body">{_.capitalize(employee.profile.name)}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="menu__background" onClick={this.props.close}/>
      </span>
    );
  }
});
