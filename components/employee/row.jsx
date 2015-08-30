/**
 * @jsx React.DOM
 */

const _ = lodash;

var FeedbackMonths = React.createClass({
  render() {
    const size = 16;
    let score = 0;
    let total = 0;

    this.props.feedbacks.map((feedback, i) => {
      if(this.props.month == feedback.month) {
        score = score + feedback.response;
        total++;
      }
    });

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
      <div className="feedback-result column_result">
        <div className="feedback-result__outer" style={outerStyle}/>
        <div className="feedback-result__inner" style={innerStyle}/>
        {/*`${score}/${total}`*/}
      </div>
    );
  }
});

EmployeeRow = React.createClass({
  PropTypes: {
    employee: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="row">
        <div className="column_details" onClick={this.props.showDetail.bind(null, 'employee', this.props.employee._id)}>
          <Card
            className="row__card"
            name={this.props.employee.profile.name}
            image={this.props.employee.profile.imageSrc}/>
          {/* this.props.employee.emails[0].verified ? null :
            <span className="label label-warning">Not verified</span> */}
        </div>
        {this.props.employee.profile.feedbacks ? _.times(12, (i) => {
          return (
            <FeedbackMonths
              key={i}
              feedbacks={this.props.employee.profile.feedbacks}
              month={i + 1}/>
          );
        }) : null}
      </div>
    );
  }
});
