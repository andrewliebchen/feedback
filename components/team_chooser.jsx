/**
 * @jsx React.DOM
 */

const _ = lodash;

const Team = React.createClass({
  handleTeamCheck(event) {
    if(event.target.checked) {
      Meteor.call('assignTeam', {
        team: this.props.team._id,
        employee: this.props.employee._id
      });
    } else {
      Meteor.call('removeEmployeeFromTeam', {
        team: this.props.team._id,
        employee: this.props.employee._id
      });
    }
  },

  render() {
    return (
      <li className="checkbox">
        <label>
          <input
            type="checkbox"
            defaultChecked={_.includes(this.props.team.members, this.props.employee._id)}
            onChange={this.handleTeamCheck}/>
          <strong>{this.props.team.name}</strong>
          <span className="badge pull-right">{this.props.team.members.length}</span>
        </label>
      </li>
    );
  }
});

TeamChooser = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    employee: React.PropTypes.object.isRequired
  },

  getMeteorData() {
    Meteor.subscribe('teams');

    return {
      teams: Teams.find().fetch()
    }
  },

  getInitialState() {
    return {
      dropdown: false
    }
  },

  handleToggleDropdown() {
    this.setState({dropdown: !this.state.dropdown});
  },

  handleNewTeam(event) {
    if(event.keyCode === 13) {
      Meteor.call('addTeam', {
        name: event.target.value,
        organization: Meteor.user().profile.organization,
        createdAt: Date.now(),
        members: [this.props.employee._id]
      }, (err, success) => {
        success ? React.findDOMNode(this.refs.newTeam).value = '' : null;
      });
    }
  },

  render() {
    let teamLength = _.pluck(_.where(this.data.teams, {'members': [this.props.employee._id]}), 'members').length;

    return (
      <div className="dropdown">
        <button className="btn btn-default btn-sm dropdown-toggle" onClick={this.handleToggleDropdown}>
          {teamLength == 0 ?
            <span>No teams </span>
          : <span>{`On ${teamLength} ${teamLength == 1 ? 'team' : 'teams'}`} </span>}
          <span className="caret"/>
        </button>
        {this.state.dropdown ?
          <span>
            <ul className="dropdown-menu" style={{display: 'block'}}>
              {this.data.teams.map((team, i) => {
                return <Team key={i} team={team} employee={this.props.employee}/>;
              })}
              <li className="form-inline">
                <div className="form-group">
                  <input type="type" className="form-control" placeholder="Team name" ref="newTeam" onKeyDown={this.handleNewTeam}/>
                </div>
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
      Teams.update(args.team, {
        $addToSet: {members: args.employee}
      });
    },

    'removeEmployeeFromTeam': function(args) {
      Teams.update(args.team, {
        $pull: {members: args.employee}
      })
    },

    'addTeam': function(args) {
      return Teams.insert({
        name: args.name,
        organization: args.organization,
        createdAt: args.createdAt,
        members: args.members
      });
    }
  });
}
