'use strict';

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

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
    // this.state.response maybe only temporary
    return {
      active: 0,
      response: 'none'
    };
  },

  handleFeedback(response) {
    this.setState({
      active: this.state.active + 1,
      response: response
    });
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
        <div className={`feedback-card__wrapper feedback-response_${this.state.response}`}>
          <CSSTransitionGroup transitionName="feedback">
            {this.data.employees.map((employee, i) => {
              if(i < 5 && i >= this.state.active) {
                return <FeedbackCard employee={employee} index={i} key={i}/>;
              }
            })}
          </CSSTransitionGroup>
          {this.state.active === 5 ?
            <div className="null">All done!</div>
          : <FeedbackActions handleFeedback={this.handleFeedback}/>}
        </div>
      </div>
    );
  }
});

if (Meteor.isClient) {
  Meteor.startup(function () {
    React.render(<App />, document.getElementById('root'));
  });
}
