/**
 * @jsx React.DOM
 */

var NewOrganizationModal = React.createClass({
  render() {
    return (
      <div className="modal" style={{display: 'block'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Create a new organization</h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Organization name</label>
                <input type="text" className="form-control" placeholder="Acme Corp, for example" ref="organizationName"/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-default" onClick={this.props.toggleModal}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={this.props.createOrganization.bind(null, this.refs.organizationName)}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

Header = ReactMeteor.createClass({
  startMeteorSubscriptions() {
    Meteor.subscribe('organizations');
  },

  getMeteorState() {
    return {
      organizations: Organizations.find().fetch()
    }
  },

  getInitialState() {
    return {
      newOrganization: false
    };
  },

  handleToggleNewOrganization() {
    this.setState({newOrganization: !this.state.newOrganization});
  },

  handleCreateOrganization(organizationName) {
    Meteor.call('createOrganization', {
      name: React.findDOMNode(organizationName).value
    }, function(error, success) {
      success ? this.handleToggleNewOrganization : null;
    });
  },

  render() {
    return (
      <header className="header">
        <div className="header__brand">
          <a href="/"><strong>Feedback</strong></a>
          <select defaultValue={this.props.currentOrganization} onChange={this.props.changeOrganization}>
            {this.state.organizations.map((organization, i) => {
              return <option key={i} value={organization.name}>{organization.name}</option>;
            })}
          </select>
          <button className="btn btn-default btn-xs" onClick={this.handleToggleNewOrganization}>
            New
          </button>
        </div>
        <div className="header__session">
          <IncludeTemplate template={Template.loginButtons}/>
        </div>

        {this.state.newOrganization ?
          <NewOrganizationModal
            toggleModal={this.handleToggleNewOrganization}
            createOrganization={this.handleCreateOrganization}/>
        : null}
      </header>
    );
  }
});

if(Meteor.isServer) {
  Meteor.publish('organizations', function() {
    return Organizations.find();
  });

  Meteor.methods({
    'createOrganization': function(args) {
      return Organizations.insert({
        name: args.name
      });
    }
  });
}
