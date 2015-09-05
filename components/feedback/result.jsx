/**
 * @jsx React.DOM
 */

const _ = lodash;

FeedbackResults = React.createClass({
  render() {
    const size = 16;
    let score = 0;
    let total = 0;

    if(this.props.feedbacks) {
      this.props.feedbacks.map((feedback, i) => {
        if(this.props.month == feedback.month) {
          score = score + feedback.response;
          total++;
        }
      });
    }

    let outerStyle = {
      width: total * size,
      height: total * size,
      borderRadius: total * size * 0.5
    };
    let innerStyle = {
      width: score * size,
      height: score * size,
      borderRadius: score * size * 0.5
    };

    return (
      <div className="feedback-result column">
        <div className="feedback-result__outer" style={outerStyle}/>
        <div className="feedback-result__inner" style={innerStyle}/>
        {total > 0 ?
          <div className="feedback-result__tooltip">
            {`${score}/${total}`}
          </div>
        : null}
        <div className="feedback-result__label">{moment(this.props.month, 'M').format('MMM')}</div>
      </div>
    );
  }
});
