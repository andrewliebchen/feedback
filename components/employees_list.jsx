/**
 * @jsx React.DOM
 */

var _ = lodash;

var EmployeeRow = React.createClass({
  handleSelectTeam(event) {
    Meteor.call('employeeTeam', {
      id: this.props.employee._id,
      team: event.target.value
    })
  },

  render() {
    return (
      <tr>
        <td>
          <div className="media">
            <div className="media-left">
              <img src={this.props.employee.picture.thumbnail} className="img-rounded" width="24"/>
            </div>
            <div className="media-body">
              {`${_.capitalize(this.props.employee.name.first)} ${_.capitalize(this.props.employee.name.last)}`}
            </div>
          </div>
        </td>
        <td>
          <select defaultValue={this.props.employee.team} onChange={this.handleSelectTeam}>
            <option value="no team">No team</option>
            <option value="team 1">Team 1</option>
            <option value="team 2">Team 2</option>
            <option value="team 3">Team 3</option>
          </select>
        </td>
        {this.props.employee.feedback ?
          <td>
            {this.props.employee.feedback.map((feedback, i) => {
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
      Employees.update(args.id, {
        $set: {team: args.team}
      });
    },

    'newEmployee': function(employee) {
      Employees.insert(employee.results[0].user);
    },

    'downloadEmployees': function() {
      return exportcsv.exportToCSV(Employees.find().fetch());
    }
  });
}
