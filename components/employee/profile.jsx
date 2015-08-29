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

  handleNewFeedbackSession() {
    Meteor.call('createFeedbackSession', this.props.employee._id);
  },

  handleDelete() {
    if(window.confirm("Are you sure you want to delete this employee? This action can't be undone.")) {
      Meteor.call('deleteEmployee', this.props.employee._id);
    }
  },


  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);

    return (
      <div>
        <FeedbackCard
          index={0}
          name={this.props.employee.profile.name}
          image={this.props.employee.profile.imageSrc}
          id={this.props.employee._id}
          className="sidebar__card"
          editable/>
        <Tabs
          defaultTabNum={0}
          tabNames={["Profile", "Performance"]}>
          <section className="panel-body">
            <FormGroup
              label="Name"
              defaultValue={_.startCase(this.props.employee.profile.name)}
              onChange={this.handleUpdateEmployeeName}/>
            <FormGroup
              label="Username"
              defaultValue={this.props.employee.username}
              onChange={this.handleUpdateEmployeeUsername}/>
            <FormGroup
              label="Email"
              defaultValue={this.props.employee.emails[0].address}
              onChange={this.handleUpdateEmployeeEmail}/>
            <div className="form-group">
              <label>Team</label>
              <TeamChooser employee={this.props.employee}/>
            </div>
            {canEdit ?
              <span>
                <button className="btn btn-default"
                  onClick={this.handleNewFeedbackSession}>
                  Add feedback session
                </button>
                {Meteor.userId() !== this.props.employee._id ?
                  <button className="btn btn-danger"
                    onClick={this.handleDelete}>
                    Delete
                  </button>
                : null}
              </span>
            : null}
          </section>
          <section className="panel-body">
            Performance
          </section>
        </Tabs>
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
    },

    'createFeedbackSession': function(employeeId) {
      let employees = Meteor.users.find().fetch();
      let employee = Meteor.users.findOne(employeeId);

      createFeedbackSession(employees, employee);
    },

    'deleteEmployee': function(id) {
      return Meteor.users.remove(id);
    }
  });
}
