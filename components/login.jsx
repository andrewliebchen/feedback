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

if(Meteor.isClient) {
  FlowRouter.route('/login', {
    action: function(param) {
      $(document).ready(function() {
        React.render(<Login/>, document.getElementById('yield'));
      });
    }
  });
}