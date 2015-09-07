/**
 * @jsx React.DOM
 */

const cx = React.addons.classSet;
const _ = lodash;

const EmployeeActions = React.createClass({
  render() {
    return (
      <span>
        <button className="btn btn-default btn-block"
          onClick={this.handleDownload}>
          Download CSV
        </button>
        <button className="btn btn-danger btn-block"
          onClick={this.handleDeleteAllEmployees}>
          Delete all employees
        </button>
      </span>
    );
  }
});

EmployeeList = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      teams: Teams.find().fetch(),
      employees: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch()
    };
  },

  getInitialState() {
    return {
      show: 0
    };
  },

  handleListToggle(index) {
    this.setState({show: index});
  },

  render() {
    let canEdit = Roles.userIsInRole(Meteor.userId(), ['admin']);

    return (
      <span>
        <div className="panel__body">
          <div className="btn-group">
            <a className={`btn btn-default btn-sm ${this.state.show === 0 ? 'is-active' : null}`}
              onClick={this.handleListToggle.bind(null, 0)}>
              List
            </a>
            <a className={`btn btn-default btn-sm ${this.state.show === 1 ? 'is-active' : null}`}
              onClick={this.handleListToggle.bind(null, 1)}>
              Teams
            </a>
          </div>

          {this.state.show === 0 ?
            <span>
              {this.data.employees.map((employee, i) => {
                return <Avatar employee={employee} key={i}/>;
              })}
              {canEdit ? <EmployeeActions/> : null}
            </span>
          : null}
          {this.state.show === 1 ?
            <span>
              <TeamsList
                teams={this.data.teams}
                employees={this.data.employees}
                editable={canEdit}/>
              {canEdit ? <NewTeam/> : null}
            </span>
          : null}
        </div>
      </span>
    );
  }
});
