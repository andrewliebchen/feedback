/**
 * @jsx React.DOM
 */

const _ = lodash;

NewEmployeeForm = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    organization: React.PropTypes.object.isRequired,
    teams: React.PropTypes.array.isRequired
  },

  getMeteorData() {
    return {
      employees: Meteor.users.find().fetch()
    };
  },

  getInitialState() {
    return {
      name: null,
      teams: [],
      success: false
    };
  },

  updateNewEmployeeName() {
    // This will have to include pictures
    this.setState({name: React.findDOMNode(this.refs.name).value});
  },

  handleAddtoTeam(team) {
    this.setState({teams: this.state.teams.concat([team])});
  },

  handleNewEmployee() {
    let newEmployee = {
      username: React.findDOMNode(this.refs.email).value,
      email: `${React.findDOMNode(this.refs.email).value}@${this.props.organization.domain}`,
      organization: this.props.organization._id,
      name: React.findDOMNode(this.refs.name).value,
      teams: this.state.teams
    };

    // Create the employee
    Meteor.call('newEmployee', newEmployee, (err, success) => {
      if(success){
        let employee = success;
        _.forEach(this.state.teams, (team) => {
          Meteor.call('assignTeam', {
            team: team,
            employee: employee
          });
        });
        this.setState({success: true});
      } else {
        console.log(err);
      };
    });
  },

  render() {
    return (
      <div className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Create your profile</h3>
        </header>
        {this.state.success ?
          <span>You did it!</span>
        :
          <span>
            <div className="panel-body">
              <FeedbackCard name={this.state.name} image={null} index={0}/>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={this.updateNewEmployeeName}
                  ref="name"/>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    ref="email"/>
                  <div className="input-group-addon">@{this.props.organization.domain}</div>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <h4>Teams</h4>
              <p>Pick the teams you're on</p>
              <ul className="list-group">
                {this.props.teams.map((team, i) => {
                  let employees = this.data.employees;
                  return (
                    <li className="list-group-item" key={i}>
                      <label>
                        <input type="checkbox" onChange={this.handleAddtoTeam.bind(null, team._id)}/>
                        {team.name}
                      </label>
                      {team.members.length > 0 ? team.members.map((member, i) => {
                        let employee = _.filter(employees, {_id: member});
                        return <Avatar employee={employee[0]} key={i}/>;
                      }) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
            <footer className="panel-footer">
              <button className="btn btn-primary" onClick={this.handleNewEmployee}>Create profile</button>
            </footer>
          </span>
        }
      </div>
    );
  }
})

const NewEmployee = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      organization: Organizations.findOne(),
      teams: Teams.find().fetch()
    };
  },

  render() {
    return (
      <div className="container">
        <Header noSession/>
        <NewEmployeeForm
          organization={this.data.organization}
          teams={this.data.teams}/>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/:_id/employees/new', {
    subscriptions: function(params) {
      this.register('newEmployee', Meteor.subscribe('newEmployee', params._id));
    },

    action: function() {
      FlowRouter.subsReady('newEmployee', function() {
        ReactLayout.render(NewEmployee);
      });
    }
  });
}

if(Meteor.isServer) {
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
  });

  Meteor.methods({
    'newEmployee': function(employee) {
      let newUserId = Accounts.createUser({
        username: employee.username,
        email: employee.email,
        profile: {
          organization: employee.organization,
          teams: employee.teams,
          gender: employee.gender,
          name: employee.name,
          imageSrc: employee.imageSrc,
        }
      });

      Accounts.sendEnrollmentEmail(newUserId);
      return newUserId;
    },
  });
}
