/**
 * @jsx React.DOM
 */

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

Header = React.createClass({
  render() {
    return (
      <header className="header">
        <div className="header__brand">
          <a href="/admin"><strong>Feedback</strong></a>
        </div>
        {this.props.session ?
          <div className="header__session">
            <IncludeTemplate template={Template.loginButtons}/>
          </div>
        : null}
      </header>
    );
  }
});

Drawer = React.createClass({
  handleCloseDrawer() {
    FlowRouter.setQueryParams({
      show: null,
      id: null
    });
  },

  render() {
    return (
      <div className="drawer">
        <button className="btn btn-default btn-sm" onClick={this.handleCloseDrawer}>close</button>
        {this.props.children}
      </div>
    );
  }
})

Layout = React.createClass({
  renderDrawer() {
    let type = FlowRouter.getQueryParam('show');
    let id = FlowRouter.getQueryParam('id');

    // Switch statement?
    switch(type) {
      case 'employee':
        return <Drawer><EmployeeProfile employee={Meteor.users.findOne(id)}/></Drawer>;

      case 'organization':
        return <Drawer><EditOrganization/></Drawer>;

      case 'new_employee':
        return (
          <Drawer>
            <NewEmployeeForm
              organization={Organizations.findOne()}
              teams={Teams.find().fetch()}/>
          </Drawer>
        );

      case 'email_invite':
        return <Drawer><EmailInvite organization={Organizations.findOne()}/></Drawer>;
    }
  },

  render() {
    return (
      <div className="container">
        <Header session/>
        {this.props.content}
        <CSSTransitionGroup transitionName="drawer">
          {this.renderDrawer()}
        </CSSTransitionGroup>
      </div>
    );
  }
});
