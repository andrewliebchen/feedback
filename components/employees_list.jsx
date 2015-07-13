/**
 * @jsx React.DOM
 */

var _ = lodash;

var EmployeeRow = React.createClass({
  handleSelectTeam(event) {
    Meteor.call('employeeTeam', {
      id: this.props.employee._id,
      team: event.target.value
    });
  },

  render() {
    return (
      <tr>
        <td><Avatar employee={this.props.employee.profile}/></td>
        <td>
          <select defaultValue={this.props.employee.profile.team} onChange={this.handleSelectTeam}>
            <option value="no team">No team</option>
            <option value="team 1">Team 1</option>
            <option value="team 2">Team 2</option>
            <option value="team 3">Team 3</option>
          </select>
        </td>
        {this.props.employee.profile.feedback ?
          <td>
            {this.props.employee.profile.feedback.map((feedback, i) => {
              return <span key={i}>{feedback.response === 'positive' ? "👍" : "👎"}</span>;
            })}
          </td>
        : <td/>}
      </tr>
    );
  }
});

EmployeesList = React.createClass({
  handleAddEmployee() {
    $.ajax({
      url: 'http://api.randomuser.me/',
      dataType: 'json',
      success: function(data){
        Meteor.call('newEmployee', data);
      }
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
        var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
        saveAs(blob, 'employee_list.csv');
      }
    });
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
              return <EmployeeRow key={i} employee={employee}/>;
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
          <button className="btn btn-primary" onClick={this.handleAddEmployee}>
            New employee
          </button>
        </footer>
      </section>
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

    'newEmployee': function(employee) {
      Accounts.createUser({
        username: employee.results[0].user.username,
        email : employee.results[0].user.email,
        password : employee.results[0].user.password,
        profile: {
          team: 'no team',
          gender: employee.results[0].user.gender,
          name: {
            first: employee.results[0].user.name.first,
            last: employee.results[0].user.name.last
          },
          picture: {
            large: employee.results[0].user.picture.large,
            medium: employee.results[0].user.picture.medium,
            thumbnail: employee.results[0].user.picture.thumbnail,
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
