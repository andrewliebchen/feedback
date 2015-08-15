/**
 * @jsx React.DOM
 */

const Team = React.createClass({
  renderTeamMembers() {

  },

  render() {
    console.log(this.props.team);
    return (
      <li className="list-group-item">
        {this.props.team}
      </li>
    );
  }
});

Teams = React.createClass({
  render() {
    return (
      <section className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Teams</h3>
        </header>
        <div className="panel-body">
          <ul className="list-group">
            {this.props.organization.teams.map((team, i) => {
              return <Team team={team} key={i}/>;
            })}
          </ul>
        </div>
      </section>
    );
  }
});
