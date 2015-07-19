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

  render() {
    return (
      <tr>
        <td>
          <Avatar employee={this.props.employee}/></td>
        <td>
          <TeamChooser organization={this.props.organization}/>
          {/*
          <select defaultValue={this.props.employee.profile.team} onChange={this.handleSelectTeam}>
            <option value="no team">No team</option>
            <option value="team 1">Team 1</option>
            <option value="team 2">Team 2</option>
            <option value="team 3">Team 3</option>
          </select>
          */}
        </td>
        {this.props.employee.profile.feedback ?
          <td>
            {this.props.employee.profile.feedback.map((feedback, i) => {
              return <span key={i}>{feedback.response === 'positive' ? "👍" : "👎"}</span>;
            })}
          </td>
        : <td/>}
        <td>
          <a href={`/employees/${this.props.employee._id}`} className="btn btn-default btn-sm">Edit</a>
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
    }
  });
}
