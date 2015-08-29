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

  render() {
    return (
      <span>
        <a className="header__session header__block" onClick={this.handleMenuToggle}>
          <img src={Meteor.user().profile.imageSrc}/>
        </a>
        {this.state.menu ?
          <div className="overlay">
            <div className="overlay__toggle">close</div>
            Profile
            Sign out
          </div>
        : null}
      </span>
    );
  }
});

Header = React.createClass({
  render() {
    return (
      <header className="header column_app">
        <a href="/" className="header__brand header__block">F</a>
        {this.props.session ?
          <Session/>
        : null}
      </header>
    );
  }
});
