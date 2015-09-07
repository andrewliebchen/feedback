/**
 * @jsx React.DOM
 */

NewTeam = React.createClass({
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
      <button
        className="btn btn-primary btn-block teams-list__add-team"
        onClick={this.handleAddTeam}>
        Add team
      </button>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
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
