/**
 * @jsx React.DOM
 */

const _ = lodash;

const Team = React.createClass({
  getInitialState() {
    return {
      dropdown: false
    };
  },

  handleUpdateTeamName(event) {
    Meteor.call('updateTeamName', {
      id: this.props.team._id,
      name: event.target.value
    });
  },

  handleDeleteTeam() {
    if(this.props.team.members.length > 0) {
      if(window.confirm('This team has members. Are you sure you want to delete it?')) {
        Meteor.call('deleteTeam', this.props.team._id);
      }
    } else {
      Meteor.call('deleteTeam', this.props.team._id);
    }
  },

  handleRemoveEmployee(employeeId) {
    Meteor.call('removeEmployeeFromTeam', {
      team: this.props.team._id,
      employee: employeeId
    });
  },

  handleToggleDropdown() {
    this.setState({dropdown: !this.state.dropdown});
  },

  handleAddEmployee(employee) {
    Meteor.call('addEmployeeToTeam', {
      employee: employee,
      team: this.props.team._id
    });
    this.setState({dropdown: !this.state.dropdown});
  },

  render() {
    return (
      <div className="panel panel-default">
        <header className="panel-heading">
          <div className="row">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.team.name}
                onChange={this.handleUpdateTeamName}/>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-danger btn-sm pull-right"
                onClick={this.handleDeleteTeam}>
                Delete
              </button>
            </div>
          </div>
        </header>
        {this.props.team.members.length > 0 ?
          <table className="table">
            <tbody>
              {this.props.team.members.map((member, i) => {
                let employee = _.filter(this.props.employees, {_id: member});
                return (
                  <tr key={i}>
                    <td><Avatar employee={employee[0]}/></td>
                    <td>
                      <button
                        className="btn btn-default btn-xs"
                        onClick={this.handleRemoveEmployee.bind(null, employee[0]._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        : null}
        <div className="panel-body">
          <div className="dropdown">
            <button className="btn btn-default btn-xs" onClick={this.handleToggleDropdown}>
              Add member <span className="caret"/>
            </button>
            {this.state.dropdown ?
              <span>
                <div className="dropdown-menu" style={{display: 'block'}}>
                  <EmployeeChooser handleSelectEmployee={this.handleAddEmployee}/>
                </div>
                <div className="dropdown__background" onClick={this.handleToggleDropdown}/>
              </span>
            : null}
          </div>
        </div>
      </div>
    );
  }
});

TeamsList = React.createClass({
  PropTypes: {
    teams: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      teams: []
    };
  },

  handleAddTeam() {
    Meteor.call('addTeam', {
      name: '',
      organization: Meteor.user().profile.organization,
      createdAt: Date.now(),
      members: []
    });
  },

  render() {
    return (
      <section className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Teams</h3>
        </header>
        <div className="panel-body">
          {this.props.teams.map((team, i) => {
            return <Team team={team} employees={this.props.employees} key={i}/>;
          })}
          <button className="btn btn-primary" onClick={this.handleAddTeam}>Add team</button>
        </div>
      </section>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'updateTeamName': function(args) {
      Teams.update(args.id, {
        $set: {name: args.name}
      });
    },

    'deleteTeam': function(team) {
      Teams.remove(team);
    },

    'addEmployeeToTeam': function(args) {
      Teams.update(args.team, {
        $addToSet: {members: args.employee}
      })
    }
  });
}
