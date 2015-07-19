/**
 * @jsx React.DOM
 */

var _ = lodash;

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
        var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
        saveAs(blob, 'employee_list.csv');
      }
    });
  },

  handleAddSeedEmployee() {
    $.ajax({
      url: 'http://api.randomuser.me/',
      dataType: 'json',
      success: (data) => {
        Meteor.call('newEmployee', data.results[0].user, Meteor.user().profile.organization);
      }
    });
  },

  toggleNewEmployeeModal() {
    this.setState({newEmployeeModal: !this.state.newEmployeeModal});
  },

  handleAddEmployee() {
    Meteor.call(
      'basicNewEmployee',
      React.findDOMNode(this.refs.newEmployeeEmail).value,
      Meteor.user().profile.organization
    );
    this.setState({newEmployeeEmail: false});
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
        </footer>

        {this.state.newEmployeeModal ?
          <Modal>
            <div className="modal-header">
              <button className="close" onClick={this.toggleNewEmployeeModal}>&times;</button>
              <h4 className="modal-title">New Employee</h4>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>New Employee Email</label>
                <input
                  ref="newEmployeeEmail"
                  className="form-control"
                  type="Text"
                  placeholder="fran@example.com"/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this.toggleNewEmployeeModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={this.handleAddEmployee}>Add employee</button>
            </div>
          </Modal>
        : null}
      </section>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'newEmployee': function(employee, currentOrganizationId) {
      return Accounts.createUser({
        username: employee.username,
        email: employee.email,
        password: employee.password,
        profile: {
          organization: currentOrganizationId,
          team: 'no team',
          gender: employee.gender,
          name: {
            first: employee.name.first,
            last: employee.name.last
          },
          picture: {
            large: employee.picture.large,
            medium: employee.picture.medium,
            thumbnail: employee.picture.thumbnail,
          }
        }
      });
    },

    'basicNewEmployee': function(employeeEmail, currentOrganizationId) {
      return Accounts.createUser({
        username: '',
        email: employeeEmail,
        password: '',
        profile: {
          organization: currentOrganizationId,
          team: 'no team',
          gender: '',
          name: {
            first: '',
            last: ''
          },
          picture: {
            large: '',
            medium: '',
            thumbnail: '',
          }
        }
      });
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
