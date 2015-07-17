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

  render() {
    return (
      <div className="container">
        <Header />
        <div className="panel panel-default">
          {this.state.employee.profile ?
          <div className="panel-body">
            <img src={this.state.employee.profile.picture.medium} className="img-rounded"/>
            <FormGroup
              label="First name"
              defaultValue={_.capitalize(this.state.employee.profile.name.first)}/>
            <FormGroup
              label="Last name"
              defaultValue={_.capitalize(this.state.employee.profile.name.last)}/>
            <FormGroup
              label="Username"
              defaultValue={this.state.employee.username}/>
            {/*<FormGroup
              label="Email"
              type="email"
              defaultValue={this.state.employee.emails[0]}/>*/}
            <FormGroup
              label="Team"
              defaultValue={this.state.employee.profile.team}/>
            <FormGroup
              label="Gender"
              defaultValue={this.state.employee.profile.gender}/>
          </div>
          : <span>SET IT UP</span>}
          <footer className="panel-footer">
            <button className="btn btn-primary">Update profile</button>
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
      $(document).ready(function() {
        React.render(<EmployeeProfile/>, document.getElementById('yield'));
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('employeeProfile', function(id) {
    return Meteor.users.find({_id: id});
  });
}
