/**
 * @jsx React.DOM
 */

Layout = React.createClass({
  render(session) {
    return (
      <div className="container">
        <header className="header">
          <div className="header__brand">
            <a href="/"><strong>Feedback</strong></a>
          </div>
            <div className="header__session">
              <IncludeTemplate template={Template.loginButtons}/>
            </div>
        </header>
        {this.props.content}
      </div>
    );
  }
});
