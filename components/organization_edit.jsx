/**
 * @jsx React.DOM
 */

const cx = React.addons.classSet;
const _ = lodash;

EditOrganization = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      organization: Organizations.findOne()
    };
  },

  handleSaveOrganization() {
    Meteor.call('updateOrganization', {
      id: this.data.organization._id,
      name: React.findDOMNode(this.refs.orgName).value
    });
  },

  handleFeedbackToggle() {
    Meteor.call('toggleFrequency', {
      id: this.data.organization._id,
      status: !this.data.organization.feedback.status
    });
  },

  handleFeedbackFrequency() {

  },

  render() {
    let feedbackStatusClassName = cx({
      "btn": true,
      "btn-success": this.data.organization.feedback.status,
      "btn-danger": !this.data.organization.feedback.status
    });

    return (
      <div>
        <section className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">Organization</h3>
          </header>
          <div className="panel-body">
            <div className="form-group">
              <label>Organization name</label>
              <input
                type="text"
                className="form-control"
                ref="orgName"
                defaultValue={this.data.organization.name}/>
            </div>
            <div className="form-group">
              <button className={feedbackStatusClassName} onClick={this.handleFeedbackToggle}>
                {`Feedback ${this.data.organization.feedback.status ? 'on' : 'off'}`}
              </button>
            </div>
            <div className="form-group">
              <label>Feedback frequency</label>
              <select
                className="form-control"
                defaultValue={this.data.organization.feedback.frequency}
                onChange={this.handleFeedbackFrequency}>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
            <dl>
              <dt>Created</dt>
              <dd>{moment(this.data.organization.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</dd>
            </dl>
          </div>
          <footer className="panel-footer">
            <button
              className="btn btn-primary"
              onClick={this.handleSaveOrganization}>
              Save
            </button>
          </footer>
        </section>
        <section className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">Teams</h3>
          </header>
          <div className="panel-body">
            <ul className="list-group">
              {this.data.organization.teams.map((team, i) => {
                return (
                  <li className="list-group-item" key={i}>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={team}/>
                  </li>
                );
              })}
            </ul>
          </div>
          <footer className="panel-footer">
            <button
              className="btn btn-primary"
              onClick={this.handleSaveTeams}>
              Save
            </button>
          </footer>
        </section>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/organization', {
    subscriptions: function(params) {
      this.register('organization', Meteor.subscribe('organization'));
    },

    action: function() {
      FlowRouter.subsReady('organization', function() {
        ReactLayout.render(Layout, {
          content: <EditOrganization/>
        });
      });
    }
  });
}

if(Meteor.isServer) {
  Meteor.methods({
    'updateOrganization': function(args) {
      Organizations.update(args.id, {
        $set: {name: args.name}
      });
    },

    'toggleFrequency': function(args) {
      Organizations.update(args.id, {
        $set: {'feedback.status': args.status}
      });
    }
  });
}
