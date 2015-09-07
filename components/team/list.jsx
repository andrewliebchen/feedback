/**
 * @jsx React.DOM
 */

const _ = lodash;

const TeamMembers = React.createClass({
  getInitialState() {
    return {
      employeeList: false
    };
  },

  handleToggleEmployeeList() {
    this.setState({employeeList: !this.state.employeeList});
  },

  handleRemoveEmployee(employeeId) {
    Meteor.call('removeEmployeeFromTeam', {
      team: this.props.team._id,
      employee: employeeId
    });
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
      <div className="team__members">
        {this.props.team.members.map((member, i) => {
          let employee = _.filter(this.props.employees, {_id: member});
          return (
            <div className="team__member" key={i}>
              <Avatar employee={employee[0]} key={i}/>
              {this.props.editable ?
                <a
                  className="team__member__remove negative"
                  onClick={this.handleRemoveEmployee.bind(null, employee[0]._id)}>
                  ×
                </a>
              : null}
            </div>
          );
        })}
        {this.props.editable ?
          <div className="team__add">
            <a
              className="btn btn-default btn-sm btn-block"
              onClick={this.handleToggleEmployeeList}>
              Add team member
            </a>
            {this.state.employeeList ?
              <EmployeeChooser
                selectEmployee={this.handleAddEmployee}
                close={this.handleToggleEmployeeList}/>
            : null}
          </div>
        : null}
      </div>
    );
  }
});

const Team = React.createClass({
  PropTypes: {
    team: React.PropTypes.object.isRequired,
    employees: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      edit: false,
      members: false
    };
  },

  handleEditToggle() {
    this.setState({edit: !this.state.edit});
  },

  handleToggleMembers() {
    this.setState({members: !this.state.members});
  },

  handleUpdateTeamName() {
    Meteor.call('updateTeamName', {
      id: this.props.team._id,
      name: React.findDOMNode(this.refs.teamName).value
    });
    this.setState({edit: false});
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

  render() {
    return (
      <div className="team">
        <div className="team__header">
          {!this.state.edit ?
            <span>
              <strong>{this.props.team.name} </strong>
              {this.props.editable ? <a onClick={this.handleEditToggle}>edit</a> : null}
            </span>
          :
            <span className="team__edit">
              <input
                type="text"
                className="form-control"
                defaultValue={this.props.team.name}
                ref="teamName"
                autoFocus/>
              <a className="btn btn-default btn-xs" onClick={this.handleUpdateTeamName}>
                Save
              </a>
            </span>
          }
          <div className="team__header__actions">
            {this.props.employees ?
              <a className="team__members-toggle" onClick={this.handleToggleMembers}>
                {this.state.members ? 'Hide' : 'Show'}
              </a>
            : null}
            {this.props.editable ? <a className="negative" onClick={this.handleDeleteTeam}>×</a> : null}
          </div>
        </div>
        {this.state.members ?
          <TeamMembers
            team={this.props.team}
            employees={this.props.employees}
            editable={this.props.editable}/>
        : null}
      </div>
    );
  }
});

TeamsList = React.createClass({
  PropTypes: {
    teams: React.PropTypes.array.isRequired,
    employees: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      teams: []
    };
  },

  render() {
    return (
      <div className="teams-list">
        {this.props.teams.map((team, i) => {
          return (
            <Team
              key={i}
              team={team}
              employees={this.props.employees}
              editable={this.props.editable}/>
          );
        })}
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
