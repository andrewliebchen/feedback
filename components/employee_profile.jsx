/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeeProfile = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employee: Meteor.users.findOne(FlowRouter.getParam('_id'))
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

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body">
            <FeedbackCard name={this.data.employee.profile.name} image={this.data.employee.profile.imageSrc} index={0}/>
            <ImageUploader employeeId={this.data.employee._id}/>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                defaultValue={_.capitalize(this.data.employee.profile.name)}
                onChange={this.handleUpdateEmployeeName}/>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                defaultValue={this.data.employee.username}
                onChange={this.handleUpdateEmployeeUsername}/>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                defaultValue={this.data.employee.emails[0].address}
                onChange={this.handleUpdateEmployeeEmail}/>
            </div>
          </div>
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
        ReactLayout.render(Layout, {
          content: <EmployeeProfile/>
        });
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.publish('employeeProfile', function(id) {
    return Meteor.users.find(id);
  });

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
