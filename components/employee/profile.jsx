/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeeProfile = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employee: Meteor.users.findOne(this.props.id)
    };
  },

  handleUpdateEmployeeName(event) {
    Meteor.call('updateEmployeeName', {
      id: this.data.employee._id,
      name: event.target.value
    });
  },

  handleUpdateEmployeeUsername(event) {
    Meteor.call('updateEmployeeUsername', {
      id: this.data.employee._id,
      username: event.target.value
    });
  },

  handleUpdateEmployeeEmail(event) {
    Meteor.call('updateEmployeeEmail', {
      id: this.data.employee._id,
      email: event.target.value
    });
  },

  handleNewFeedbackSession() {
    Meteor.call('createFeedbackSession', this.data.employee._id);
  },

  handleDelete() {
    if(window.confirm("Are you sure you want to delete this employee? This action can't be undone.")) {
      Meteor.call('deleteEmployee', this.data.employee._id);
    }
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);

    return (
      <span>
        <div className="panel__card__wrapper">
          <Card
            name={this.data.employee.profile.name}
            image={this.data.employee.profile.imageSrc}
            id={this.data.employee._id}
            className="panel__card"
            editable="employee"/>
        </div>
        <Tabs
          defaultTabNum={0}
          tabNames={["Profile", "Performance"]}>
          <section>
            <div className="panel__body">
              <FormGroup
                label="Name"
                value={_.startCase(this.data.employee.profile.name)}
                onChange={this.handleUpdateEmployeeName}/>
              <FormGroup
                label="Username"
                value={this.data.employee.username}
                onChange={this.handleUpdateEmployeeUsername}/>
              <FormGroup
                label="Email"
                value={this.data.employee.emails[0].address}
                onChange={this.handleUpdateEmployeeEmail}/>
              <div className="form-group">
                <label>Team</label>
                <TeamChooser employee={this.data.employee}/>
              </div>
            </div>
            {canEdit && Meteor.userId() !== this.data.employee._id ?
              <div className="panel__body">
                <button className="btn btn-danger btn-block"
                  onClick={this.handleDelete}>
                  Delete
                </button>
              </div>
            : null}
          </section>
          <section>
            {canEdit ?
              <div className="panel__body">
                <button className="btn btn-default btn-block"
                  onClick={this.handleNewFeedbackSession}>
                  Add feedback session
                </button>
              </div>
            : null}
          </section>
        </Tabs>
      </span>
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
      let employees = Meteor.users.find({}, {sort: {createdAt: 1}}).fetch();
      let employee = Meteor.users.findOne(employeeId);

      createFeedbackSession(employees, employee);
    },

    'deleteEmployee': function(id) {
      return Meteor.users.remove(id);
    }
  });
}
