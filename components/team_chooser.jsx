/**
 * @jsx React.DOM
 */

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
      Organizations.update(args.org, {
        $addToSet: {'teams': args.team}
      });
    }
  });
}
