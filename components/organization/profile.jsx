/**
 * @jsx React.DOM
 */

const cx = React.addons.classSet;
const _ = lodash;

OrganizationProfile = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      organization: Organizations.findOne(),
      teams: Teams.find().fetch(),
      employees: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
      feedbackSessions: FeedbackSessions.find().fetch()
    };
  },

  handleUpdateOrganizationName(event) {
    Meteor.call('updateOrganizationName', {
      id: this.data.organization._id,
      name: event.target.value
    });
  },

  handleUpdateOrganizationDomain(event) {
    Meteor.call('updateOrganizationDomain', {
      id: this.data.organization._id,
      domain: event.target.value
    });
  },

  handleFeedbackToggle() {
    Meteor.call('toggleFrequency', {
      id: this.data.organization._id,
      status: !this.data.organization.feedback.status
    });
  },

  handleFeedbackFrequency(event) {
    Meteor.call('feedbackFrequency', {
      id: this.data.organization._id,
      frequency: event.target.value
    });
  },

  handleDeleteAllEmployees() {
    if(window.confirm(`Are you sure you want to delete all employees? This will also delete all feedback sessions.`)) {
      Meteor.call('deleteAllEmployees');
    }
  },

  handleDownload() {
    Meteor.call('downloadEmployees', function(err, fileContent) {
      if(fileContent){
        let blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
        saveAs(blob, 'employee_list.csv');
      }
    });
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);
    let feedbackStatusClassName = cx({
      "switch": true,
      "is-on": this.data.organization.feedback.status
    });

    return (
      <span>
        <div className="panel__card__wrapper">
          <Card
            name={this.data.organization.name}
            image={this.data.organization.imageSrc}
            id={this.data.organization._id}
            className="panel__card"
            editable="organization"/>
        </div>
        <Tabs
          defaultTabNum={0}
          tabNames={["Details", "Employees", "Feedbacks"]}>
          <section>
            <div className="panel__body">
              <FormGroup
                label="Organization name"
                value={this.data.organization.name}
                onChange={this.handleUpdateOrganizationName}/>
              <FormGroup
                label="Email domain"
                value={this.data.organization.domain}
                onChange={this.handleUpdateOrganizationDomain}/>
              <div className="form-group">
                <div className={feedbackStatusClassName} onClick={this.handleFeedbackToggle}>
                  <div className="switch__head"/>
                </div>
                <span className="switch__label">{`Feedback ${this.data.organization.feedback.status ? 'on' : 'off'}`}</span>
              </div>
              <div className="form-group">
                <label>Feedback frequency</label>
                <select
                  className="form-control"
                  defaultValue={this.data.organization.feedback.frequency}
                  onChange={this.handleFeedbackFrequency}
                  disabled={!this.data.organization.feedback.status}>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
              <div className="form-group">
                <label>Created</label>
                <div>{moment(this.data.organization.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
              </div>
            </div>
          </section>
          <section>
            <EmployeeList/>
          </section>
          <section>
            <FeedbackSessionsList
              feedbackSessions={this.data.feedbackSessions}
              employees={this.data.employees}/>
          </section>
        </Tabs>
      </span>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'updateOrganizationName': function(args) {
      Organizations.update(args.id, {
        $set: {name: args.name}
      });
    },

    'updateOrganizationDomain': function(args) {
      Organizations.update(args.id, {
        $set: {domain: args.domain}
      });
    },

    'toggleFrequency': function(args) {
      Organizations.update(args.id, {
        $set: {'feedback.status': args.status}
      });
      Meteor.call('scheduleFeedbackSessions');
    },

    'feedbackFrequency': function(args) {
      Organizations.update(args.id, {
        $set: {'feedback.frequency': args.frequency}
      });
      Meteor.call('scheduleFeedbackSessions');
    },

    'deleteAllEmployees': function() {
      Meteor.users.remove({});
      FeedbackSessions.remove({});
    },

    'downloadEmployees': function() {
      return exportcsv.exportToCSV(Employees.find().fetch());
    }
  });
}
