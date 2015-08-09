/**
 * @jsx React.DOM
 */

EmployeeRow = React.createClass({
  handleSelectTeam(event) {
    Meteor.call('employeeTeam', {
      id: this.props.employee._id,
      team: event.target.value
    });
  },

  handleDelete() {
    Meteor.call('deleteEmployee', this.props.employee._id);
  },

  render() {
    return (
      <tr>
        <td><Avatar employee={this.props.employee}/></td>
        {this.props.employee.profile.feedback ?
          <td>
            {this.props.employee.profile.feedback.map((feedback, i) => {
              return <span key={i}>{feedback.response === 'positive' ? "👍" : "👎"}</span>;
            })}
          </td>
        : <td/>}
        <td>
          <TeamChooser
            organization={this.props.organization}
            employee={this.props.employee}/>
        </td>
        <td>
          <a href={`/employees/${this.props.employee._id}`} className="btn btn-default btn-sm">Edit</a>
        </td>
        <td>
          <button className="btn btn-danger btn-sm" onClick={this.handleDelete}>X</button>
        </td>
      </tr>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'employeeTeam': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          "profile.team": args.team
        }
      });
    },

    'deleteEmployee': function(id) {
      return Meteor.users.remove(id);
    }
  });
}
