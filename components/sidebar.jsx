/**
 * @jsx React.DOM
 */

const _ = lodash;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

Sidebar = React.createClass({
  renderContent() {
    let type = FlowRouter.getQueryParam('show');
    let id = FlowRouter.getQueryParam('id');

    switch(type) {
      case 'employee':
        return <EmployeeProfile id={id}/>;

      case 'new_employee':
        return <NewEmployeeForm organization={Organizations.findOne()} teams={Teams.find().fetch()}/>;

      case 'email_invite':
        return <EmailInvite organization={Organizations.findOne()}/>;

      default:
        return <OrganizationProfile/>;
    }
  },

  render() {
    return (
      <aside className="sidebar column_sidebar">
        <div className="sidebar__container">
          {this.renderContent()}
        </div>
      </aside>
    );
  }
});
