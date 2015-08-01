/**
 * @jsx React.DOM
 */

NewEmployeeForm = React.createClass({
  getInitialState() {
    return {
      hidePassword: true
    };
  },

  handleNewEmployee() {
    var newEmployee = {
      username: React.findDOMNode(this.refs.email).value,
      email: `${React.findDOMNode(this.refs.email).value}@${this.props.organization.domain}`,
      password: React.findDOMNode(this.refs.password).value,
      organization: this.props.organization._id,
      firstName: React.findDOMNode(this.refs.firstName).value,
      lastName: React.findDOMNode(this.refs.lastName).value
    };

    Meteor.call('newEmployee', newEmployee, function(err, success) {
      success ? FlowRouter.go('/') : console.log('Whoops!');
    });
  },

  handlePasswordToggle() {
    this.setState({hidePassword: !this.state.hidePassword});
  },

  render() {
    return (
      <div className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Create your profile</h3>
        </header>
        <div className="panel-body">
          <div className="form-group">
            <label>Email</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                ref="email"/>
              <div className="input-group-addon">{this.props.organization.domain}</div>
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
              <input
                type={this.state.hidePassword ? 'password' : 'text'}
                className="form-control"
                ref="password"/>
              <div className="input-group-addon" onClick={this.handlePasswordToggle}>
                {this.state.hidePassword ? 'show' : 'hide'}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              ref="firstName"/>
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              ref="lastName"/>
          </div>
        </div>
        <footer className="panel-footer">
          <button className="btn btn-primary" onClick={this.handleNewEmployee}>Create profile</button>
        </footer>
      </div>
    );
  }
})

var NewEmployee = ReactMeteor.createClass({
  getMeteorState() {
    return {
      organization: Organizations.findOne()
    };
  },

  render() {
    return (
      <div className="container">
        <Header noSession/>
        <NewEmployeeForm organization={this.state.organization}/>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/:_id/employees/new', {
    subscriptions: function(params) {
      this.register('newEmployee', Meteor.subscribe('newEmployee', params._id));
    },

    action: function() {
      FlowRouter.subsReady('newEmployee', function() {
        React.render(<NewEmployee/>, document.getElementById('yield'));
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('newEmployee', function(id) {
    return Organizations.find({_id: id});
  });
}
