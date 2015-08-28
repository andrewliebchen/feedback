/**
 * @jsx React.DOM
 */

const _ = lodash;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

Header = React.createClass({
  render() {
    return (
      <header className="header column_app">
        <a href="/" className="header__brand">F</a>
        {this.props.session ?
          <div className="header__session">
            <IncludeTemplate template={Template.loginButtons}/>
          </div>
        : null}
      </header>
    );
  }
});

Sidebar = React.createClass({
  render() {
    return (
      <aside className="sidebar">
        <div className="sidebar__container">
          {this.props.children}
        </div>
      </aside>
    );
  }
})

Layout = React.createClass({
  renderSidebar() {
    let type = FlowRouter.getQueryParam('show');
    let id = FlowRouter.getQueryParam('id');

    // Switch statement?
    switch(type) {
      case 'employee':
        return (
          <Sidebar>
            <EmployeeProfile employee={Meteor.users.findOne(id)}/>
          </Sidebar>
        );

      case 'new_employee':
        return (
          <Sidebar>
            <NewEmployeeForm
              organization={Organizations.findOne()}
              teams={Teams.find().fetch()}/>
          </Sidebar>
        );

      case 'email_invite':
        return (
          <Sidebar>
            <EmailInvite organization={Organizations.findOne()}/>
          </Sidebar>
        );

      default:
        return (
          <Sidebar>
            <EditOrganization/>
          </Sidebar>
        );
    }
  },

  render() {
    return (
      <div className="container">
        <Header session/>
        {this.props.content}
        {this.renderSidebar()}
      </div>
    );
  }
});
