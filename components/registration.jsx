/**
 * @jsx React.DOM
 */

var _ = lodash;

Registration = ReactMeteor.createClass({
  getMeteorState() {
    return {
      organization: Organizations.findOne()
    };
  },

  handleCreateEmployee() {
    Meteor.call('registerEmployee', {
      email: React.findDOMNode(this.refs.email).value,
      password: React.findDOMNode(this.refs.password).value,
      profile: {
        organization: this.state.organization._id,
        name: {
          first: React.findDOMNode(this.refs.firstName).value,
          last: React.findDOMNode(this.refs.lastName).value
        }
      }
    }, function(error, success) {
      if(success) {
        FlowRouter.go('/login');
      } else {
        console.log(error);
      }
    });
  },

  render() {
    return (
      <div className="container">
        <Header/>
        <section className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">Register for {this.state.organization.name}</h3>
          </header>
          <form>
            <div className="panel-body">
              <p>Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh.</p>
              <div className="form-group">
                <label>Your email</label>
                <input type="email" className="form-control" ref="email" required/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" ref="password" required/>
              </div>
              <div className="form-group">
                <label>First name</label>
                <input type="type" className="form-control" ref="firstName"/>
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input type="type" className="form-control" ref="lastName"/>
              </div>
            </div>
            <footer className="panel-footer">
              <button className="btn btn-primary" onClick={this.handleCreateEmployee}>Join organization</button>
            </footer>
          </form>
        </section>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/register/:_id', {
    subscriptions: function(params) {
      this.register('registration', Meteor.subscribe('registration', params._id));
    },

    action: function() {
      FlowRouter.subsReady('registration', function() {
        ReactLayout.render(Registration);
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('registration', function(id) {
    return Organizations.find({_id: id});
  });

  Meteor.methods({
    'registerEmployee': function(employee) {
      return Accounts.createUser({
        email: employee.email,
        password: employee.password,
        profile: {
          organization: employee.profile.organization,
          name: {
            first: employee.profile.name.first,
            last: employee.profile.name.last
          }
        }
      });
    }
  });
}
