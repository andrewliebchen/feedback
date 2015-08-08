/**
 * @jsx React.DOM
 */

const _ = lodash;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

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

FeedbackSession = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      employees: Meteor.users.find().fetch(),
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
      id: this.data.employees[this.state.active]._id,
      response: response,
      period: this.data.feedbackSession.period,
      feedbackSession: this.data.feedbackSession[0]._id,
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
          {this.data.employees.map((employee, i) => {
            if(i >= this.state.active) {
              return (
                <FeedbackCard
                  name={employee.profile.name}
                  image={employee.profile.imageSrc}
                  index={i}
                  key={i}/>
              );
            }
          })}
        </CSSTransitionGroup>
        {this.state.active === this.data.employees.length ?
          <div className="null">All done!</div>
        : <FeedbackActions handleFeedback={this.handleFeedback}/>}
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/feedbacks/:_id', {
    subscriptions: function(params) {
      this.register('feedbackSession', Meteor.subscribe('feedbackSession', params._id));
    },

    action: function() {
      FlowRouter.subsReady('feedbackSession', function() {
        ReactLayout.render(Layout, {
          content: <FeedbackSession/>
        });
      });
    }
  });
};

if(Meteor.isServer) {
  Meteor.publish('feedbackSession', function(id){
    return [
      FeedbackSessions.find(id),
      Meteor.users.find({
        _id: {$in: FeedbackSessions.findOne(id).employees}
      })
    ];
  });

  Meteor.methods({
    'addFeedback': function(args){
      return Meteor.users.update(args.id,{
        $addToSet: {
          'profile.feedback': {
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
