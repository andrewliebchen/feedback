/**
 * @jsx React.DOM
 */

var _ = lodash;

var Team = React.createClass({
  handleTeamCheck(event) {
    if(event.target.checked) {
      Meteor.call('assignTeam', {
        employeeId: this.props.employee._id,
        team: this.props.team
      });
    } else {
      Meteor.call('removeTeam', {
        employeeId: this.props.employee._id,
        team: this.props.team
      });
    }
  },

  render() {
    return (
      <li className="checkbox">
        <label>
          <input
            type="checkbox"
            defaultChecked={_.includes(this.props.employee.profile.teams, this.props.team)}
            onChange={this.handleTeamCheck}/>
          {this.props.team}
        </label>
      </li>
    );
  }
});

TeamChooser = React.createClass({
  getInitialState() {
    return {
      dropdown: false
    }
  },

  handleToggleDropdown() {
    this.setState({dropdown: !this.state.dropdown});
  },

  handleNewTeam() {
    Meteor.call('addTeam', {
      org: Meteor.user().profile.organization,
      team: React.findDOMNode(this.refs.newTeam).value
    });
  },

  render() {
    return (
      <div className="dropdown">
        <button className="btn btn-default btn-sm dropdown-toggle" onClick={this.handleToggleDropdown}>
          Select team <span className="caret"/>
        </button>
        {this.state.dropdown ?
          <span>
            <ul className="dropdown-menu" style={{display: 'block'}}>
              {this.props.organization.teams.map((team, i) => {
                return <Team key={i} team={team} employee={this.props.employee}/>;
              })}
              <li className="form-inline">
                <div className="form-group">
                  <input type="type" className="form-control" ref="newTeam" placeholder="Team name"/>
                </div>
                <button className="btn btn-default btn-sm" onClick={this.handleNewTeam}>Add</button>
              </li>
            </ul>
            <div className="dropdown__background" onClick={this.handleToggleDropdown}/>
          </span>
        : null}
      </div>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'assignTeam': function(args) {
      Meteor.users.update(args.employeeId, {
        $addToSet: {'profile.teams': args.team}
      });
    },

    'removeTeam': function(args) {
      Meteor.users.update(args.employeeId, {
        $pull: {'profile.teams': args.team}
      })
    },

    'addTeam': function(args) {
      Organizations.update(args.org, {
        $addToSet: {'teams': args.team}
      });
    }
  });
}
