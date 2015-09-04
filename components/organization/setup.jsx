/**
 * @jsx React.DOM
 */

const cx = React.addons.classSet;

const STEPS = [
  'Create your account',
  'Set up your organiation',
  'Create some teams'
];

let teams = [];

const Section = React.createClass({
  render() {
    return (
      <span>
        <div className="breadcrumbs">
          {STEPS.map((step, i) => {
            let stepClassName = cx({
              'breadcrumb': true,
              'is-selected': this.props.step === i
            });

            return (
              <div className={stepClassName} key={i}>{step}</div>
            );
          })}
        </div>
        <section className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">{this.props.title ? this.props.title : STEPS[this.props.step]}</h3>
          </header>
          {this.props.children}
        </section>
      </span>
    );
  }
});

const Account = React.createClass({
  mixins: [ShowPasswordMixin],

  getInitialState() {
    return {
      loading: false
    };
  },

  handleCreateAdmin(event) {
    event.preventDefault();

    let adminEmail = React.findDOMNode(this.refs.adminEmail).value;
    this.setState({loading: true});
    Meteor.call('createAdmin', {
      username: adminEmail,
      email: adminEmail,
      name: React.findDOMNode(this.refs.adminName).value,
      password: React.findDOMNode(this.refs.adminPassword).value
    }, (err, admin) => {
      if(admin) {
        let rx = /^([\w\.]+)@([\w\.]+)$/;
        let rxEmail = rx.exec(adminEmail);

        this.setState({loading: false});
        Session.set('admin', admin);
        Session.set('domain', rxEmail[2]);
        FlowRouter.go('/setup/organization');
      }
    });
  },

  render() {
    return (
      <Section step={0}>
        <form>
          <div className="panel-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui.</p>
            <div className="form-group">
              <label>Your name</label>
              <input
                type="text"
                className="form-control"
                ref="adminName"
                required/>
            </div>
            <div className="form-group">
              <label>Your work email</label>
              <input
                type="text"
                className="form-control"
                ref="adminEmail"
                required/>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={this.state.showPassword ? 'text' : 'password'}
                  className="form-control"
                  ref="adminPassword"
                  required/>
                <div className="input-group-addon" onClick={this.handleTogglePassword}>
                  {this.state.showPassword ? 'hide' : 'show'}
                </div>
              </div>
            </div>
          </div>
          <footer className="panel-footer">
            <input
              type="submit"
              className="btn btn-primary"
              onSubmit={this.handleCreateAdmin}
              value={this.state.loading ? 'loading' : 'Next'}/>
          </footer>
        </form>
      </Section>
    );
  }
});

const Organization = React.createClass({
  getInitialState() {
    return {
      loading: false
    };
  },

  handleCreateOrganization(event) {
    event.preventDefault();

    this.setState({loading: true});
    Meteor.call('createOrganization', {
      admin: Session.get('admin'),
      name: React.findDOMNode(this.refs.orgName).value,
      domain: React.findDOMNode(this.refs.orgDomain).value,
      createdAt: Date.now()
    }, (err, organization) => {
      if(organization) {
        this.setState({loading: false});
        Session.set('organization', organization);
        FlowRouter.go('/setup/teams');
      }
    });
  },

  render() {
    return (
      <Section step={1}>
        <form>
          <div className="panel-body">
            <p>Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est.</p>
            <div className="form-group">
              <label>Organization's name</label>
              <input
                type="text"
                className="form-control"
                ref="orgName"
                placeholder="Kramerica, Inc."/>
            </div>
            <div className="form-group">
              <label>Organization's email domain</label>
              <input
                type="text"
                className="form-control"
                defaultValue={Session.get('domain')}
                ref="orgDomain"
                placeholder="kramerica.com"/>
              <small className="help-block">Everything after the @ in your work email</small>
            </div>
          </div>
          <footer className="panel-footer">
            <input
              type="submit"
              className="btn btn-primary"
              onSubmit={this.handleCreateOrganization}
              value={this.state.loading ? 'loading' : 'Next'}/>
          </footer>
        </form>
      </Section>
    );
  }
});

const Teams = React.createClass({
  getInitialState() {
    return {
      loading: false,
      teams: []
    };
  },

  handleAddTeam(event) {
    if(event.keyCode == 13) {
      teams.push(event.target.value);

      this.setState({teams: teams});
      React.findDOMNode(this.refs.teamName).value = '';
    }
  },

  goToFinish() {
    FlowRouter.go('/setup/finish');
  },

  handleAddTeams() {
    let organization = Session.get('organization');

    _.forEach(teams, function(team) {
      Meteor.call('addTeam', {
        team: team,
        organziation: organization,
        createdAt: Date.now()
      });
    });

    this.goToFinish()
  },

  render() {
    return (
      <Section step={2}>
        <form>
          <div className="panel-body">
            <p>Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur vulputate.</p>
            {this.state.teams.map((team, i) => {
              return <div key={i}>{team}</div>;
            })}
            <div className="form-group">
              <label>Team Name</label>
              <input
                type="text"
                className="form-control"
                ref="teamName"
                onKeyDown={this.handleAddTeam}
                placeholder="Enter a team and press enter"/>
            </div>
          </div>
          <footer className="panel-footer">
            <button className="btn btn-default" onClick={this.goToFinish}>
              Skip this for now
            </button>
            <input
              type="submit"
              className="btn btn-primary"
              onSubmit={this.handleAddTeams}
              value="Contine"/>
          </footer>
        </form>
      </Section>
    );
  }
});

const Finish = React.createClass({
  handleSendEmail(event) {
    let message = `${React.findDOMNode(this.refs.message).value} Visit http://${Meteor.settings.public.siteURL}/${Session.get('organization')}/employees/new to sign up!`
    Meteor.call('sendInviteEmail', {
      to: React.findDOMNode(this.refs.to).value,
      subject: React.findDOMNode(this.refs.subject).value,
      message: message
    });

    FlowRouter.go('/admin');
  },

  render() {
    return (
      <Section title="All done!" step={3}>
        <form>
          <div className="panel-body">
            <p>Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis.</p>
            <div className="form-group">
              <label>To</label>
              <input
                type="text"
                className="form-control"
                placeholder="Seperate each address by a comma"
                ref="to"/>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                className="form-control"
                defaultValue="Create your profile on Feedback"
                ref="subject"/>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-control"
                defaultValue="Sign up for this service or you're fired."
                ref="message"/>
            </div>
          </div>
          <footer className="panel-footer">
            <button href="/admin" className="btn btn-default">View dashboard</button>
            <input
              type="submit"
              className="btn btn-primary"
              onSubmit={this.handleSendEmail}
              value="Send and finish"/>
          </footer>
        </form>
      </Section>
    );
  }
});

if(Meteor.isClient) {
 FlowRouter.route('/setup/account', {
   action: function() {
     ReactLayout.render(LayoutNarrow, {
       content: <Account/>
     });
   }
 });

 FlowRouter.route('/setup/organization', {
   action: function() {
     ReactLayout.render(LayoutNarrow, {
       content: <Organization/>
     });
   }
 });

 FlowRouter.route('/setup/teams', {
   action: function() {
     ReactLayout.render(LayoutNarrow, {
       content: <Teams/>
     });
   }
 });

 FlowRouter.route('/setup/finish', {
   action: function() {
     ReactLayout.render(LayoutNarrow, {
       content: <Finish/>
     });
   }
 });
}

if(Meteor.isServer) {
  Meteor.methods({
    'createAdmin': function(args) {
      let newAdminId = Accounts.createUser({
        username: args.username,
        email: args.email,
        password: args.password,
        profile: {
          name: args.name
        }
      });

      Roles.addUsersToRoles(newAdminId, ['admin']);
      return newAdminId;
    },

    'createOrganization': function(args) {
      return Organizations.insert({
        name: args.name,
        domain: args.domain,
        createdAt: args.createdAt,
        feedback: {
          status: true,
          frequency: 'Monthly'
        }
      }, (error, result) => {
        Meteor.users.update(args.admin, {
          $set: {
            'profile.organization': result
          }
        });
      });
    }
  });
}
