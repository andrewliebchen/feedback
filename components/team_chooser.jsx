/**
 * @jsx React.DOM
 */

TeamChooser = ReactMeteor.createClass({
  getMeteorState() {
    return {
      teams: Teams.find().fetch()
    }
  },

  getInitialState() {
    return {
      dropdown: true
    }
  },

  handleToggleDropdown() {
    this.setState({dropdown: !this.state.dropdown});
  },

  handleNewTeam() {
    Meteor.call('addTeam', {
      organization: Meteor.user().profile.organization,
      name: React.findDOMNode(this.refs.newTeam).value
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
              {this.state.teams.map((team, i) => {
                return <li key={i}><a>{team.name}</a></li>;
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

if(Meteor.isClient) {
  Meteor.subscribe('teams');
}

if(Meteor.isServer) {
  Meteor.publish('teams', function() {
    var currentOrgId = Meteor.users.findOne({_id: this.userId}).profile.organization;
    return Teams.find({
      organization: currentOrgId
    });
  });

  Meteor.methods({
    'addTeam': function(args) {
      Teams.insert({
        organization: args.organization,
        name: args.name
      });
    }
  });
}
