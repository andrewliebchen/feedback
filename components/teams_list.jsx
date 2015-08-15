/**
 * @jsx React.DOM
 */

const _ = lodash;

const Team = React.createClass({
  handleRemoveEmployee(employeeId) {
    Meteor.call('removeEmployee', {
      team: this.props.team._id,
      employee: employeeId
    });
  },

  render() {
    return (
      <div className="panel panel-default">
        <header className="panel-heading clearfix">
          <h4 className="panel-title pull-left">{this.props.team.name}</h4>
          <button className="btn btn-danger btn-xs pull-right">Delete team</button>
        </header>
        {this.props.team.members.length > 0 ?
          <table className="table">
            <tbody>
              {this.props.team.members.map((member, i) => {
                let employee = _.filter(this.props.employees, {_id: member});
                return (
                  <tr key={i}>
                    <td><Avatar employee={employee[0]}/></td>
                    <td>
                      <button
                        className="btn btn-default btn-xs"
                        onClick={this.handleRemoveEmployee.bind(null, employee[0]._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        : <div className="panel-body">No members</div>}
      </div>
    );
  }
});

TeamsList = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    Meteor.subscribe('teams');
    Meteor.subscribe('employees');

    return {
      teams: Teams.find().fetch(),
      employees: Meteor.users.find().fetch()
    }
  },

  render() {
    return (
      <section className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Teams</h3>
        </header>
        <div className="panel-body">
          {this.data.teams.map((team, i) => {
            return <Team team={team} employees={this.data.employees} key={i}/>;
          })}
        </div>
      </section>
    );
  }
});

if(Meteor.isServer) {
  Meteor.methods({
    'removeEmployee': function(args) {
      Teams.update(args.team, {
        $pull: {
          members: args.employee
        }
      });
    }
  });
}
