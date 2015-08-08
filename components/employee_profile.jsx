/**
 * @jsx React.DOM
 */

var _ = lodash;

EmployeeProfile = ReactMeteor.createClass({
  getMeteorState() {
    return {
      employee: Meteor.users.findOne(FlowRouter.getParam('_id'))
    };
  },

  getInitialState() {
    return {
      employeeName: null
    };
  },

  updateNewEmployeeName() {
    // This will have to include pictures
    this.setState({employeeName: React.findDOMNode(this.refs.name).value});
  },

  handleEmployeeUpdate() {
    Meteor.call('updateEmployee', {
      id: this.state.employee._id,
      name: React.findDOMNode(this.refs.name).value,
      username: React.findDOMNode(this.refs.username).value,
      email: React.findDOMNode(this.refs.email).value
    });
  },

  componentDidMount() {
    // Need to wait until state is ready to get employee name
    this.setState({employeeName: this.state.employee.profile.name})
  },

  render() {
    return (
      <div className="container">
        <Header />
        <div className="panel panel-default">
          <div className="panel-body">
            <FeedbackCard name={this.state.employeeName} image={this.state.employee.profile.imageSrc} index={0}/>
            <ImageUploader employeeId={this.state.employee._id}/>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                defaultValue={_.capitalize(this.state.employee.profile.name)}
                onChange={this.updateNewEmployeeName}
                ref="name"/>
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
        ReactLayout.render(EmployeeProfile);
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('employeeProfile', function(id) {
    return Meteor.users.find(id);
  });

  Meteor.methods({
    'updateEmployee': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          'profile.name': args.name,
          'username': args.username,
          'email.0.address': args.email
        }
      });
    }
  });
}
