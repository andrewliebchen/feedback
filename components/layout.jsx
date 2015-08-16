/**
 * @jsx React.DOM
 */

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

    if(type === 'employee') {
      return <Drawer><EmployeeProfile employee={Meteor.users.findOne(id)}/></Drawer>;
    }

    if(type === 'organization') {
      return <Drawer><EditOrganization/></Drawer>;
    }
  },

  render() {
    return (
      <div className="container">
        <Header session/>
        {this.props.content}
        {this.renderDrawer()}
      </div>
    );
  }
});
