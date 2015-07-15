/**
 * @jsx React.DOM
 */


Login = React.createClass({
  render() {
    return (
      <div className="login">
        <IncludeTemplate template={Template.loginButtons}/>
      </div>
    );
  }
});
