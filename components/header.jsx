/**
 * @jsx React.DOM
 */

Header = React.createClass({
  render() {
    return (
      <header className="header">
        <div className="header__brand">
          <a href="/"><strong>Feedback</strong></a>
        </div>
        <div className="header__session">
          <IncludeTemplate template={Template.loginButtons}/>
        </div>
      </header>
    );
  }
});
