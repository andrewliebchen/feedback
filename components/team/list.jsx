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
      <div>
        <div className="selector__item">
          <label className="selector__item__label">
            {/*<input type="checkbox" onChange={this.handleAddtoTeam.bind(null, team._id)}/>*/}
            <strong>{this.props.team.name}</strong>
              <div className="dropdown">
                <a onClick={this.handleToggleDropdown}>+</a>
                {this.state.dropdown ?
                  <span>
                    <div className="dropdown-menu" style={{display: 'block'}}>
                      <EmployeeChooser handleSelectEmployee={this.handleAddEmployee}/>
                    </div>
                    <div className="dropdown__background" onClick={this.handleToggleDropdown}/>
                  </span>
                : null}
              </div>
          </label>
          {this.props.team.members.map((member, i) => {
            let employee = _.filter(this.props.employees, {_id: member});
            return (
              <div>
                <Avatar employee={employee[0]} key={i}/>
                <a onClick={this.handleRemoveEmployee.bind(null, employee[0]._id)}>
                  X
                </a>
              </div>
            );
          })}
        </div>

        {/*<input
          type="text"
          className="form-control"
          defaultValue={this.props.team.name}
          onChange={this.handleUpdateTeamName}/>
        <button
          className="btn btn-danger btn-sm pull-right"
          onClick={this.handleDeleteTeam}>
          Delete
        </button>*/}
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
      <div className="panel__body">
        {this.props.teams.map((team, i) => {
          return <Team team={team} employees={this.props.employees} key={i}/>;
        })}
        <button
          className="btn btn-primary btn-block"
          onClick={this.handleAddTeam}>
          Add team
        </button>
      </div>
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
