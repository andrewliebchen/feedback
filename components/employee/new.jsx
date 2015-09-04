/**
 * @jsx React.DOM
 */

const _ = lodash;

NewEmployeeForm = React.createClass({
  mixins: [ReactMeteorData, ShowPasswordMixin],

  propTypes: {
    organization: React.PropTypes.object.isRequired,
    teams: React.PropTypes.array.isRequired
  },

  getMeteorData() {
    return {
      employees: Meteor.users.find({}, {sort: {createdAt: 1}}).fetch(),
      image: Session.get('newImageUrl')
    };
  },

  getInitialState() {
    return {
      name: null,
      teams: [],
      loading: false,
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
      password: React.findDOMNode(this.refs.password).value,
      organization: this.props.organization._id,
      name: React.findDOMNode(this.refs.name).value,
      teams: this.state.teams,
      imageSrc: this.data.image
    };

    this.setState({loading: true});

    // Create the employee
    Meteor.call('newEmployee', newEmployee, (err, success) => {
      if(success){
        let employee = success;

        // Add teams
        _.forEach(this.state.teams, (team) => {
          Meteor.call('assignTeam', {
            team: team,
            employee: employee
          });
        });

        // Reset the state
        this.setState({
          loading: false,
          success: true
        });
      } else {
        console.log(err);
        this.setState({loading: false});
      };
    });
  },

  render() {
    return (
      <div>
        <header className="sidebar__header">
          <h3 className="sidebar__title">Create your profile</h3>
        </header>
        {this.state.success ?
          <div className="panel-body">
            <p><strong>Awesome!</strong> Check your email, you should recieve a link to validate your account and create a password.</p>
          </div>
        :
          <form className="panel-body">
            <div className="form-group">
              <Card
                name={this.state.name}
                image={this.data.image}
                index={0}
                editable="employee"
                className="new-employee__card"/>
            </div>
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
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <input type={this.state.showPassword ? 'text' : 'password'} className="form-control" ref="password"/>
                <div className="input-group-addon" onClick={this.handleTogglePassword}>
                  {this.state.showPassword ? 'hide' : 'show'}
                </div>
              </div>
            </div>
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
            <input
              type="submit"
              className="btn btn-primary"
              onSubmit={this.handleNewEmployee}
              value={this.state.loading ? 'loading' : 'Create profile'}/>
          </form>
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
      <div className="panel panel-default">
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
        ReactLayout.render(LayoutNarrow, {
          content: <NewEmployee/>
        });
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
        password: employee.password,
        profile: {
          organization: employee.organization,
          teams: employee.teams,
          gender: employee.gender,
          name: employee.name,
          imageSrc: employee.imageSrc,
        }
      });

      Accounts.sendVerificationEmail(newUserId);
      return newUserId;
    },
  });
}
