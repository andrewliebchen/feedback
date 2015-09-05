/**
 * @jsx React.DOM
 */

const _ = lodash;

const Session = React.createClass({
  getInitialState() {
    return {
      menu: false
    };
  },

  handleMenuToggle() {
    this.setState({menu: !this.state.menu});
  },

  handleProfile() {
    FlowRouter.setQueryParams({
      show: 'employee',
      id: Meteor.user()._id
    });
    this.handleMenuToggle();
  },

  handleSignOut() {
    Meteor.logout();
    this.handleMenuToggle();
  },

  render() {
    return (
      <span>
        <a className="header__session menu__toggle" onClick={this.handleMenuToggle}>
          <img src={Meteor.user().profile.imageSrc}/>
        </a>
        {this.state.menu ?
          <Menu className="header__session__menu" toggle={this.handleMenuToggle}>
            <Avatar employee={Meteor.user()}/>
            <MenuItem handleClick={this.handleProfile}>Profile</MenuItem>
            <MenuItem handleClick={this.handleSignOut}>Sign out</MenuItem>
          </Menu>
        : null}
      </span>
    );
  }
});

Header = React.createClass({
  render() {
    return (
      <header className="header column_app">
        <a href="/" className="header__brand">Feedback</a>
        <div className="header__search form-group">
          <input type="search" className="form-control" placeholder="Search"/>
        </div>
        {this.props.session ?
          <Session/>
        : null}
      </header>
    );
  }
});
