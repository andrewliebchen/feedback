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
      active: 0
    };
  },

  handleFeedback(response) {
    let newActiveEmployee = this.state.active + 1;

    this.setState({
      response: response,
      active: newActiveEmployee
    });

    Meteor.call('addFeedback', {
      id: this.data.employees[newActiveEmployee]._id,
      response: response,
      month: this.data.feedbackSession[0].month,
      year: this.data.feedbackSession[0].year,
      feedbackSession: this.data.feedbackSession[0]._id,
      createdAt: Date.now()
    });

    if(newActiveEmployee === this.data.employees.length - 1) {
      Meteor.call('feedbackSessionComplete', this.data.feedbackSession[0]._id);
    }
  },

  _handleDocumentClick(event) {
    // Positive
    if(event.keyCode === 39) {
      this.handleFeedback(1);
    }

    // Negative
    if(event.keyCode === 37) {
      this.handleFeedback(0);
    }
  },

  componentWillMount(){
    document.addEventListener('keydown', this._handleDocumentClick, false);
  },

  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleDocumentClick, false);
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
            if(i > this.state.active && employee._id !== Meteor.userId()) {
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

        {this.state.active === this.data.employees.length - 1 ?
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
  Meteor.methods({
    'addFeedback': function(args) {
      return Meteor.users.update(args.id, {
        $addToSet: {
          'profile.feedbacks': {
            response: args.response,
            year: args.year,
            month: args.month,
            feedbackSession: args.feedbackSession,
            createdAt: args.createdAt
          }
        }
      });
    },

    'feedbackSessionComplete': function(id) {
      FeedbackSessions.update(id, {
        $set: {complete: true}
      });
    }
  });
}
