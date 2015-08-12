/**
 * @jsx React.DOM
 */

var FeedbackPeriod = React.createClass({
  render() {
    const size = 10;
    let outerStyle = {
      // width: this.props.feedback.total * size,
      // height: this.props.feedback.total * size,
      // borderRadius: this.props.feedback.total * size * 0.5
    };
    let innerStyle = {
      // width: this.props.feedback.score * size,
      // height: this.props.feedback.score * size,
      // borderRadius: this.props.feedback.score * size * 0.5
    };

    return (
      <div className="feedback-result">
        <div className="feedback-result__outer" style={outerStyle}/>
        <div className="feedback-result__inner" style={innerStyle}/>
      </div>
    );
  }
});

EmployeeRow = React.createClass({
  handleSelectTeam(event) {
    Meteor.call('employeeTeam', {
      id: this.props.employee._id,
      team: event.target.value
    });
  },

  handleNewFeedbackSession() {
    Meteor.call('createFeedbackSession', this.props.employee._id);
  },

  handleDelete() {
    Meteor.call('deleteEmployee', this.props.employee._id);
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    return (
      <tr>
        <td><Avatar employee={this.props.employee}/></td>
        {this.props.employee.profile.feedbacks ?
          <td>
            {this.props.employee.profile.feedbacks.map((feedback, i) => {
              return <FeedbackPeriod key={i} feedback={feedback}/>
            })}
          </td>
        : <td/>}
        <td>
          <TeamChooser
            organization={this.props.organization}
            employee={this.props.employee}/>
        </td>
        <td>
          {canEdit ?
            <a href={`/employees/${this.props.employee._id}`} className="btn btn-default btn-sm">Edit</a>
          : null}
        </td>
        <td>
          <button className="btn btn-default btn-sm" onClick={this.handleNewFeedbackSession}>+FS</button>
        </td>
        <td>
          {Meteor.userId() !== this.props.employee._id && canEdit ?
            <button className="btn btn-danger btn-sm" onClick={this.handleDelete}>X</button>
          : null}
        </td>
      </tr>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'employeeTeam': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          "profile.team": args.team
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
