/**
 * @jsx React.DOM
 */

const _ = lodash;

OrganizationRow = React.createClass({
  mixins: [RowActionsMixin],

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

  handleAddSeedEmployee() {
    $.ajax({
      url: 'http://api.randomuser.me/',
      dataType: 'json',
      success: (data) => {
        let randomUser = data.results[0].user;
        let newEmployee = {
          username: randomUser.username,
          email: randomUser.email,
          password: randomUser.password,
          organization: Meteor.user().profile.organization,
          name: `${randomUser.name.first} ${randomUser.name.last}`,
          imageSrc: randomUser.picture.large,
          teams: ['Team 1']
        };

        Meteor.call('newEmployee', newEmployee);
      }
    });
  },

  toggleNewEmployee() {
    FlowRouter.setQueryParams({
      show: 'new_employee'
    });
  },

  handleEmailInvite() {
    FlowRouter.setQueryParams({
      show: 'email_invite'
    });
  },

  renderActions() {
    return (
      <span>
        <div className="row__actions dropdown__menu">
          <a className="row__action"
            onClick={this.props.editOrganization}>
            Edit
          </a>
          <a className="row__action"
            onClick={this.handleDownload}>
            Download CSV
          </a>
          <a className="row__action"
            onClick={this.handleAddSeedEmployee}>
            New seed employee
          </a>
          <a className="row__action"
            onClick={this.toggleNewEmployee}>
            New employee
          </a>
          <a className="row__action"
            onClick={this.handleEmailInvite}>
            Send email invite
          </a>
          <a className="row_action"
            onClick={this.handleDeleteAllEmployees}>
            Delete all employees
          </a>
        </div>
        <div className="dropdown__background" onClick={this.handleToggleActions}/>
      </span>
    );
  },

  render() {
    return (
      <section className="organization row">
        <div className="column_details">
          <h3 className="row__title" onClick={this.handleToggleActions}>
            {this.props.organization.name}
          </h3>
          {this.props.canEdit && this.state.actions ? this.renderActions() : null}
        </div>
        <div className="row__results column_results">
          {/* Organization-wide results */}
        </div>
      </section>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'deleteAllEmployees': function() {
      Meteor.users.remove({});
      FeedbackSessions.remove({});
    },

    'downloadEmployees': function() {
      return exportcsv.exportToCSV(Employees.find().fetch());
    }
  });
}
