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
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
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
          {canEdit ?
            <a href={`/employees/${this.props.employee._id}`} className="btn btn-default btn-sm">Edit</a>
          : null}
        </td>
        <td>
          {Meteor.userId() !== this.props.employee._id && canEdit ?
            <button className="btn btn-danger btn-sm" onClick={this.handleDelete}>X</button>
          : null}
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
