/**
 * @jsx React.DOM
 */

const _ = lodash;

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
