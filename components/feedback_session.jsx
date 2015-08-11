/**
 * @jsx React.DOM
 */

const _ = lodash;
const cx = React.addons.classSet;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;


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
      response: null,
      score: 0,
      total: 0
    };
  },

  handleFeedback(response) {
    let newScore = this.state.score + response;
    let newTotal = this.state.total + 1;
    this.setState({
      response: response,
      score: newScore,
      total: newTotal
    });

    // Submit incremental results to FeedbackSession document?
    Meteor.call('addFeedbackResults', {
      id: this.data.feedbackSession[0]._id,
      employeeId: this.data.employees[newTotal]._id,
      response: response,
      year: this.data.feedbackSession[0].year,
      period: this.data.feedbackSession[0].period,
      createdAt: Date.now()
    });

    // Submit session totals to Meteor.user document
    if(newTotal === this.data.employees.length - 1) {
      Meteor.call('addFeedbackSessionResults', {
        feedbackSessionId: this.data.feedbackSession[0]._id,
        forId: this.data.feedbackSession[0].for,
        year: this.data.feedbackSession[0].year,
        period: this.data.feedbackSession[0].period,
        score: newScore,
        total: newTotal
      });
    }
  },

  render() {
    let feedbackWrapperClassName = cx({
      "feedback-card__wrapper": true,
      "feedback-response_positive": this.state.response === 1,
      "feedback-response_negative": this.state.response === 0
    });

    return (
      <div className={feedbackWrapperClassName}>
        <CSSTransitionGroup transitionName="feedback">
          {this.data.employees.map((employee, i) => {
            // Got to exclude the current user
            if(i > this.state.total && employee._id !== Meteor.userId()) {
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

        {this.state.total === this.data.employees.length - 1 ?
          <div className="null">All done!</div>
        :
          <div className="feedback-actions">
            <div
              className="feedback-action feedback-action_positive"
              onClick={this.handleFeedback.bind(null, 1)}>
              Yes
            </div>
            <div
              className="feedback-action feedback-action_negative"
              onClick={this.handleFeedback.bind(null, 0)}>
              No
            </div>
          </div>
        }
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
  // THIS IS ALL FUCKED UP!
  Meteor.methods({
    // This shouldn't be here...
    'addFeedbackResults': function(args) {
      return FeedbackSessions.update(args.id, {
        $addToSet: {
          responses: {
            employeeId: args.employeeId,
            response: args.response,
            year: args.period,
            period: args.period,
            createdAt: args.createdAt
          }
        }
      });
    },


    'addFeedbackSessionResults': function(args){
      // This is okay...
      FeedbackSessions.update(args.feedbackSessionId, {
        $set: {complete: true}
      });

      // This needs to be the individual results. We're going to have to calculate
      // the totals on the client...
      return Meteor.users.update(args.forId, {
        $addToSet: {
          'profile.feedback': {
            year: args.year,
            period: args.period,
            score: args.score,
            total: args.total
          }
        }
      });
    }
  });
}
