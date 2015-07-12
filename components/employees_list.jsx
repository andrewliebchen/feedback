/**
 * @jsx React.DOM
 */

var _ = lodash;

var EmployeeRow = React.createClass({
  handleSelectTeam(event) {
    Meteor.call('employeeTeam', {
      id: this.props.employee._id,
      team: event.target.value
    })
  },

  render() {
    return (
      <tr>
        <td>
          <div className="media">
            <div className="media-left">
              <img src={this.props.employee.picture.thumbnail} className="img-rounded" width="24"/>
            </div>
            <div className="media-body">
              {`${_.capitalize(this.props.employee.name.first)} ${_.capitalize(this.props.employee.name.last)}`}
            </div>
          </div>
        </td>
        <td>
          <select defaultValue="no team" onChange={this.handleSelectTeam}>
            <option value="no team">No team</option>
            <option value="team 1">Team 1</option>
            <option value="team 2">Team 2</option>
            <option value="team 3">Team 3</option>
          </select>
        </td>
        {this.props.employee.feedback ?
          <td>
            {this.props.employee.feedback.map((feedback, i) => {
              return <span key={i}>{feedback.response === 'positive' ? "👍" : "👎"}</span>;
            })}
          </td>
        : null}
      </tr>
    );
  }
});

EmployeesList = React.createClass({
  render() {
    return (
      <section className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Employees</h3>
        </header>
        <table className="table">
          <tbody>
            {this.props.employees.map((employee, i) => {
              return <EmployeeRow key={i} employee={employee}/>;
            })}
          </tbody>
        </table>
      </section>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'employeeTeam': function(args) {
      Employees.update(args.id, {
        $set: {team: args.team}
      });
    }
  });
}
