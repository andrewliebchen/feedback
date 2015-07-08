'use strict';

var FeedbackCard = React.createClass({
  render() {
    var employee = this.props.employee;
    return (
      <div className={`feedback-card feedback-card_${this.props.index}`}>
        <img className="feedback-card__image" src={employee.picture.large}/>
        <h2 className="feedback-card__name">{employee.name.first} {employee.name.last}</h2>
      </div>
    );
  }
});

var FeedbackActions = React.createClass({
  render() {
    return (
      <div className="feedback-actions">
        <div
          className="feedback-action feedback-action_positive"
          onClick={this.props.handleFeedback.bind(null, 'positive')}>
          Yes
        </div>
        <div
          className="feedback-action feedback-action_negative"
          onClick={this.props.handleFeedback.bind(null, 'negative')}>
          No
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employees: Employees.find().fetch()
    };
  },

  getInitialState() {
    return {
      active: 0
    };
  },

  handleFeedback(response) {
    this.setState({active: this.state.active + 1});
    console.log(response);
  },

  render() {
    return (
      <div className="feedback-card__wrapper">
        {this.data.employees.map((employee, i) => {
          if(i < 5 && i >= this.state.active) {
            return <FeedbackCard employee={employee} index={i} key={i}/>;
          }
        })}
        <FeedbackActions handleFeedback={this.handleFeedback}/>
      </div>
    );
  }
});

if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render(<App />, document.getElementById('root'));
  });
}
