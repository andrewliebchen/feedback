/**
 * @jsx React.DOM
 */

const _ = lodash;

const Team = React.createClass({
  render() {
    return (
      <li className="list-group-item">
        <strong>{this.props.team.name}</strong>
        {this.props.team.members.length > 0 ?
          <ul className="list-group">
            {this.props.team.members.map((member, i) => {
              let employee = _.filter(this.props.employees, {_id: member});
              return (
                <li key={i} className="list-group-item">
                  <Avatar employee={employee[0]}/>
                </li>  
              );
            })}
          </ul>
        : null}
      </li>
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
          <ul className="list-group">
            {this.data.teams.map((team, i) => {
              return <Team team={team} employees={this.data.employees} key={i}/>;
            })}
          </ul>
        </div>
      </section>
    );
  }
});
