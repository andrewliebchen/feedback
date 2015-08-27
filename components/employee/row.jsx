/**
 * @jsx React.DOM
 */

const _ = lodash;

var FeedbackMonths = React.createClass({
  render() {
    const size = 16;
    let score = 0;
    let total = 0;

    this.props.feedbacks.map((feedback, i) => {
      if(this.props.month == feedback.month) {
        score = score + feedback.response;
        total++;
      }
    });

    let outerStyle = {
      width: total * size,
      height: total * size,
      borderRadius: total * size * 0.5
    };
    let innerStyle = {
      width: score * size,
      height: score * size,
      borderRadius: score * size * 0.5
    };

    return (
      <div className="feedback-result column_result">
        <div className="feedback-result__outer" style={outerStyle}/>
        <div className="feedback-result__inner" style={innerStyle}/>
        {/*`${score}/${total}`*/}
      </div>
    );
  }
});

EmployeeRow = React.createClass({
  PropTypes: {
    employee: React.PropTypes.object.isRequired
  },

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
      <div className="row">
        <div className="column_details">
          <div className="row__title">
            <Avatar employee={this.props.employee} className="row__title"/>
            {this.props.employee.emails[0].verified ? null :
              <span className="label label-warning">Not verified</span>}
          </div>
          {canEdit ?
            <div className="row__actions">
              <a className="row__action"
                href={`/employees/${this.props.employee._id}`}>
                Edit
              </a>
              <div className="row__action">
                <TeamChooser employee={this.props.employee}/>
              </div>
              <a className="row__action"
                onClick={this.handleNewFeedbackSession}>
                Add feedback session
              </a>
              {Meteor.userId() !== this.props.employee._id ?
                <a className="row__action"
                  onClick={this.handleDelete}>
                  Delete
                </a>
              : null}
            </div>
          : null}
        </div>
        <div className="column_results">
          {this.props.employee.profile.feedbacks ? _.times(12, (i) => {
            return (
              <FeedbackMonths
                key={i}
                feedbacks={this.props.employee.profile.feedbacks}
                month={i + 1}/>
            );
          }) : null}
        </div>
      </div>
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
