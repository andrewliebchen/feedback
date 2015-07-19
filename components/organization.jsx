/**
 * @jsx React.DOM
 */

Organization = ReactMeteor.createClass({
  getMeteorState() {
    return {
      organization: Organizations.findOne()
    };
  },

  render() {
    return (
      <div className="container">
        <Header/>
        <section className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">Organization</h3>
          </header>
          <div className="panel-body">
            <FormGroup
              label="Organization name"
              defaultValue={this.state.organization.name}/>

            <h4>Teams</h4>
            <ul className="list-group">
              {this.state.organization.teams.map((team, i) => {
                return (
                  <li className="list-group-item" key={i}>
                    {team}
                  </li>
                );
              })}
            </ul>
          </div>
          <footer className="panel-footer">
            <button className="btn btn-primary">Save</button>
          </footer>
        </section>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/organization', {
    subscriptions: function(params) {
      this.register('organization', Meteor.subscribe('organization'));
    },

    action: function() {
      FlowRouter.subsReady('organization', function() {
        React.render(<Organization/>, document.getElementById('yield'));
      });
    }
  });
}
