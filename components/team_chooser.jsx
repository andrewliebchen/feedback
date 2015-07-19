/**
 * @jsx React.DOM
 */

TeamChooser = React.createClass({
  getInitialState() {
    return {
      teams: Organizations.findOne().teams,
      dropdown: true
    }
  },

  handleToggleDropdown() {
    this.setState({dropdown: !this.state.dropdown});
  },

  handleNewTeam() {
    // Meteor.call('addTeam', {
    //   organization: Meteor.user().profile.organization,
    //   name: React.findDOMNode(this.refs.newTeam).value
    // });
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
                return <li key={i}><a>{team}</a></li>;
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
    'addTeam': function(args) {
      Teams.insert({
        organization: args.organization,
        name: args.name
      });
    }
  });
}
