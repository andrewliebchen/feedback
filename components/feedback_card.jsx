/**
 * @jsx React.DOM
 */

var _ = lodash;

FeedbackCard = React.createClass({
  propTypes: {
    index: React.PropTypes.number,
    image: React.PropTypes.string,
    name: React.PropTypes.string
  },

  render() {
    return (
      <div className={`feedback-card feedback-card_${this.props.index}`}>
        {this.props.image ?
          <img className="feedback-card__image" src={this.props.image}/>
        : null}
        <h2 className="feedback-card__name">
          {_.capitalize(this.props.name)}
        </h2>
      </div>
    );
  }
});
