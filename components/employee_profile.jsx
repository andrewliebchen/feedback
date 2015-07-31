/**
 * @jsx React.DOM
 */

var _ = lodash;

EmployeeProfile = ReactMeteor.createClass({
  getMeteorState() {
    return {
      employee: Meteor.users.findOne({_id: FlowRouter.getParam('_id')})
    };
  },

  handleEmployeeUpdate() {
    Meteor.call('updateEmployee', {
      id: this.state.employee._id,
      firstName: React.findDOMNode(this.refs.firstName).value,
      lastName: React.findDOMNode(this.refs.lastName).value,
      username: React.findDOMNode(this.refs.username).value,
      email: React.findDOMNode(this.refs.email).value
    });
  },

  render() {
    return (
      <div className="container">
        <Header />
        <div className="panel panel-default">
          <div className="panel-body">
            <img src={this.state.employee.profile.picture.medium} className="img-rounded"/>
            <div className="form-group">
              <label>First name</label>
              <input
                type="text"
                className="form-control"
                defaultValue={_.capitalize(this.state.employee.profile.name.first)}
                ref="firstName"/>
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input
                type="text"
                className="form-control"
                defaultValue={_.capitalize(this.state.employee.profile.name.last)}
                ref="lastName"/>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                defaultValue={this.state.employee.username}
                ref="username"/>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                defaultValue={this.state.employee.emails[0].address}
                ref="email"/>
            </div>
          </div>
          <footer className="panel-footer">
            <button className="btn btn-primary" onClick={this.handleEmployeeUpdate}>Update profile</button>
          </footer>
        </div>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/employees/:_id', {
    subscriptions: function(params) {
      this.register('employeeProfile', Meteor.subscribe('employeeProfile', params._id));
    },

    action: function() {
      FlowRouter.subsReady('employeeProfile', function() {
        React.render(<EmployeeProfile/>, document.getElementById('yield'));
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('employeeProfile', function(id) {
    return Meteor.users.find({_id: id});
  });

  Meteor.methods({
    'updateEmployee': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          'profile.name.first': args.firstName,
          'profile.name.last': args.lastName,
          'username': args.username,
          'email.0.address': args.email
        }
      });
    }
  });
}
