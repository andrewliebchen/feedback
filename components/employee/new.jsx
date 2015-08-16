/**
 * @jsx React.DOM
 */

NewEmployeeForm = React.createClass({
  getInitialState() {
    return {
      newEmployeeName: null
    };
  },

  updateNewEmployeeName() {
    // This will have to include pictures
    this.setState({newEmployeeName: React.findDOMNode(this.refs.name).value});
  },

  handleNewEmployee() {
    let newEmployee = {
      username: React.findDOMNode(this.refs.email).value,
      email: `${React.findDOMNode(this.refs.email).value}@${this.props.organization.domain}`,
      organization: this.props.organization._id,
      name: React.findDOMNode(this.refs.name).value
    };

    Meteor.call('newEmployee', newEmployee, function(err, success) {
      success ? FlowRouter.go('/admin') : console.log(err);
    });
  },

  render() {
    return (
      <div className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Create your profile</h3>
        </header>
        <div className="panel-body">
          <FeedbackCard name={this.state.newEmployeeName} image={null} index={0}/>
          <div className="form-group">
            <label>Email</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                ref="email"/>
              <div className="input-group-addon">@{this.props.organization.domain}</div>
            </div>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              onChange={this.updateNewEmployeeName}
              ref="name"/>
          </div>
        </div>
        <footer className="panel-footer">
          <button className="btn btn-primary" onClick={this.handleNewEmployee}>Create profile</button>
        </footer>
      </div>
    );
  }
})

const NewEmployee = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      organization: Organizations.findOne()
    };
  },

  render() {
    return (
      <div className="container">
        <Header noSession/>
        <NewEmployeeForm organization={this.props.organization}/>
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
        ReactLayout.render(Layout, {
          content: <NewEmployee/>
        });
      });
    }
  });
}

if(Meteor.isServer) {
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
  });

  Meteor.methods({
    'newEmployee': function(employee) {
      let newUserId = Accounts.createUser({
        username: employee.username,
        email: employee.email,
        profile: {
          organization: employee.organization,
          teams: employee.teams,
          gender: employee.gender,
          name: employee.name,
          imageSrc: employee.imageSrc,
        }
      });

      Accounts.sendEnrollmentEmail(newUserId);
      return newUserId;
    },
  });
}
