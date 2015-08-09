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

Layout = React.createClass({
  render() {
    return (
      <div className="container">
        <Header session/>
        {this.props.content}
      </div>
    );
  }
});
