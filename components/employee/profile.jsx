/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeeProfile = React.createClass({
  handleUpdateEmployeeName(event) {
    Meteor.call('updateEmployeeName', {
      id: this.props.employee._id,
      name: event.target.value
    });
  },

  handleUpdateEmployeeUsername(event) {
    Meteor.call('updateEmployeeUsername', {
      id: this.props.employee._id,
      username: event.target.value
    });
  },

  handleUpdateEmployeeEmail(event) {
    Meteor.call('updateEmployeeEmail', {
      id: this.props.employee._id,
      email: event.target.value
    });
  },

  render() {
    return (
      <div>
        {this.props.employee ?
          <div className="panel panel-default">
            <div className="panel-body">
              <div className="form-group">
                <FeedbackCard
                  index={0}
                  name={this.props.employee.profile.name}
                  image={this.props.employee.profile.imageSrc}
                  id={this.props.employee._id}
                  editable/>
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={_.startCase(this.props.employee.profile.name)}
                  onChange={this.handleUpdateEmployeeName}/>
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue={this.props.employee.username}
                  onChange={this.handleUpdateEmployeeUsername}/>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  defaultValue={this.props.employee.emails[0].address}
                  onChange={this.handleUpdateEmployeeEmail}/>
              </div>
              <div className="form-group">
                <label>Team</label>
                <TeamChooser employee={this.props.employee}/>
              </div>
            </div>
          </div>
        : <span>Nope Nope Nope</span>}
      </div>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'updateEmployeeName': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          'profile.name': args.name
        }
      });
    },

    'updateEmployeeUsername': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          'profile.username': args.username
        }
      });
    },

    'updateEmployeeEmail': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          'email.0.address': args.email
        }
      });
    }
  });
}
