/**
 * @jsx React.DOM
 */

const _ = lodash;

EmployeesList = React.createClass({
  getInitialState() {
    return {
      newEmployeeModal: false
    };
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
          imageSrc: randomUser.picture.large
        };

        Meteor.call('newEmployee', newEmployee);
      }
    });
  },

  toggleNewEmployeeModal() {
    this.setState({newEmployeeModal: !this.state.newEmployeeModal});
  },

  render() {
    return (
      <section className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Employees</h3>
        </header>
        <table className="table">
          <tbody>
            {this.props.employees.map((employee, i) => {
              return <EmployeeRow key={i} employee={employee} organization={this.props.organization}/>;
            })}
          </tbody>
        </table>
        <footer className="panel-footer">
          <button className="btn btn-danger" onClick={this.handleDeleteAllEmployees}>
            Delete All
          </button>
          <button className="btn btn-default" onClick={this.handleDownload}>
            Download CSV
          </button>
          <button className="btn btn-default" onClick={this.handleAddSeedEmployee}>
            New seed employee
          </button>
          <button className="btn btn-default" onClick={this.toggleNewEmployeeModal}>
            New employee
          </button>
          <EmailInvite organizationId={this.props.organization._id}/>
        </footer>

        {this.state.newEmployeeModal ?
          <Modal close={this.toggleNewEmployeeModal}>
            <NewEmployeeForm organization={this.props.organization}/>
          </Modal>
        : null}
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
