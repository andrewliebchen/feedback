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
      <div className="container">
        <nav>
          {STEPS.map((step, i) => {
            let stepClassName = cx({
              'is-selected': this.props.step === i
            });

            return (
              <a className={stepClassName} key={i}>{step}</a>
            );
          })}
        </nav>
        <section className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">{this.props.title ? this.props.title : STEPS[this.props.step]}</h3>
          </header>
          {this.props.children}
        </section>
      </div>
    );
  }
});

const Account = React.createClass({
  getInitialState() {
    return {
      loading: false
    };
  },

  handleCreateAdmin() {
    let adminEmail = React.findDOMNode(this.refs.adminEmail).value;

    this.setState({loading: true});

    Meteor.call('createAdmin', {
      username: adminEmail,
      email: adminEmail,
      name: React.findDOMNode(this.refs.adminName).value
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
        <div className="panel-body">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui.</p>
          <div className="form-group">
            <label>Your name</label>
            <input
              type="text"
              className="form-control"
              ref="adminName"/>
          </div>
          <div className="form-group">
            <label>Your work email</label>
            <input
              type="text"
              className="form-control"
              ref="adminEmail"/>
          </div>
        </div>
        <footer className="panel-footer">
          <button className="btn btn-primary" onClick={this.handleCreateAdmin}>
            {this.state.loading ? 'loading' : 'Next'}
          </button>
        </footer>
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

  handleCreateOrganization() {
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
          <button className="btn btn-primary" onClick={this.handleCreateOrganization}>
            {this.state.loading ? 'loading' : 'Next'}
          </button>
        </footer>
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
          <button className="btn btn-primary" onClick={this.handleAddTeams}>
            Continue
          </button>
        </footer>
      </Section>
    );
  }
});

const Finish = React.createClass({
  render() {
    return (
      <Section title="All done!" step={3}>
        <div className="panel-body">
          Invite people
        </div>
        <footer className="panel-footer">
          <button href="/admin" className="btn btn-default">View dashboard</button>
          <button className="btn btn-primary">Send and finish</button>
        </footer>
      </Section>
    );
  }
});

if(Meteor.isClient) {
 FlowRouter.route('/setup/account', {
   action: function() {
     ReactLayout.render(Account);
   }
 });

 FlowRouter.route('/setup/organization', {
   action: function() {
     ReactLayout.render(Organization);
   }
 });

 FlowRouter.route('/setup/teams', {
   action: function() {
     ReactLayout.render(Teams);
   }
 });

 FlowRouter.route('/setup/finish', {
   action: function() {
     ReactLayout.render(Finish);
   }
 });
}

if(Meteor.isServer) {
  Meteor.methods({
    'createAdmin': function(args) {
      let newAdminId = Accounts.createUser({
        username: args.username,
        email: args.email,
        profile: {
          name: args.name
        }
      });

      Accounts.sendEnrollmentEmail(newAdminId);
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
