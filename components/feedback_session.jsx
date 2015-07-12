/**
 * @jsx React.DOM
 */

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var FeedbackCard = React.createClass({
  render() {
    var employee = this.props.employee;
    return (
      <div className={`feedback-card feedback-card_${this.props.index}`}>
        <img className="feedback-card__image" src={employee.picture.large}/>
        <h2 className="feedback-card__name">
          {`${_.capitalize(employee.name.first)} ${_.capitalize(employee.name.last)}`}
        </h2>
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

var FeedbackGroup = ReactMeteor.createClass({
  getMeteorState() {
    return {
      employees: Employees.find().fetch(),
      feedbackSession: FeedbackSessions.find().fetch()
    };
  },

  getInitialState() {
    return {
      active: 0,
      response: 'none'
    };
  },

  handleFeedback(response) {
    Meteor.call('addFeedback', {
      id: this.state.employees[this.state.active]._id,
      response: response,
      period: 7,
      feedbackSession: this.state.feedbackSession[0]._id,
      createdAt: Date.now()
    });

    this.setState({
      active: this.state.active + 1,
      response: response
    });
  },

  render() {
    return (
      <div className={`feedback-card__wrapper feedback-response_${this.state.response}`}>
        <CSSTransitionGroup transitionName="feedback">
          {this.state.employees.map((employee, i) => {
            if(i >= this.state.active) {
              return (
                <FeedbackCard
                  employee={employee}
                  index={i}
                  key={i}/>
              );
            }
          })}
        </CSSTransitionGroup>
        {this.state.active === 5 ?
          <div className="null">All done!</div>
        : <FeedbackActions handleFeedback={this.handleFeedback}/>}
      </div>
    );
  }
});

FeedbackSession = React.createClass({
  render(){
    return (
      <div className="wrapper">
        <Header/>
        <FeedbackGroup/>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/feedback/:_id', {
    subscriptions: function(params) {
      this.register('feedbackSession', Meteor.subscribe('feedbackSession', params._id));
    },

    action: function() {
      $(document).ready(function() {
        React.render(<FeedbackSession/>, document.getElementById('yield'));
      });
    }
  });
};

if(Meteor.isServer) {
  Meteor.publish('feedbackSession', function(id){
    return [
      FeedbackSessions.find(id),
      Employees.find({
        _id: {$in: FeedbackSessions.findOne(id).employees}
      })
    ];
  });

  Meteor.methods({
    'addFeedback': function(args){
      return Employees.update(args.id,
        {$addToSet: {
          feedback : {
            response: args.response,
            period: args.period,
            feedbackSession: args.feedbackSession,
            createdAt: args.createdAt
          }
        }
      });
    }
  });
}
