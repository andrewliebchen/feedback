/**
 * @jsx React.DOM
 */

const _ = lodash;
const cx = React.addons.classSet;

Row = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    image: React.PropTypes.string,
    feedbacks: React.PropTypes.array,
    showDetail: React.PropTypes.func
  },

  render() {
    let rowClassName= cx({
      "row": true,
      "can-edit": Roles.userIsInRole(Meteor.userId(), ['admin'])
    });

    return (
      <div className={rowClassName}>
        <Card
          className="row__card"
          name={this.props.name}
          image={this.props.image}
          handleClick={this.props.showDetail.bind(null, this.props.id)}/>
        {_.times(12, (i) => {
          return (
            <FeedbackResults
              key={i}
              feedbacks={this.props.feedbacks}
              month={i + 1}/>
          );
        })}
      </div>
    );
  }
});
