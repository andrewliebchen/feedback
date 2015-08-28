/**
 * @jsx React.DOM
 */

const _ = lodash;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

Header = React.createClass({
  render() {
    return (
      <header className="header">
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

  renderBackground() {
    return (
      <div className="background row">
        <div className="background__details column_details"/>
        <div className="background__results column_results">
          {_.times(12, (i) => {
            return (
              <div key={i} className="background__result column_result">
                <p className="background__label">{moment(i + 1, 'M').format('MMM')}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  },

  render() {
    return (
      <div className="container">
        <Header session/>
        {this.props.content}
        <CSSTransitionGroup transitionName="drawer">
          {this.renderDrawer()}
        </CSSTransitionGroup>
        {this.renderBackground()}
      </div>
    );
  }
});
