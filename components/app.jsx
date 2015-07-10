/**
 * @jsx React.DOM
 */

var _ = lodash;

var App = React.createClass({
  mixins: [ReactMeteor.Mixin],

  startMeteorSubscriptions() {
    Meteor.subscribe('employees');
  },

  getMeteorState() {
    return {
      employees: Employees.find().fetch()
    };
  },

  render() {
    return (
      <div>
        <header className="header">
          <div className="header__brand">
            <strong>Feedback</strong>
          </div>
          <div className="header__session">
            Andrew Liebchen
          </div>
        </header>
        <FeedbackGroup employees={_.take(_.shuffle(this.state.employees), 5)}/>
      </div>
    );
  }
});

if(Meteor.isClient) {
  Meteor.startup(function() {
    React.render(<App />, document.getElementById('root'));
  });
}

if(Meteor.isServer) {
  Meteor.publish('employees', function(){
    return Employees.find();
  });
}
