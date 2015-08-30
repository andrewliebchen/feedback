/**
 * @jsx React.DOM
 */

const _ = lodash;

Background = React.createClass({
  render() {
    return (
      <div className="background container row">
          <div className="column_details"/>
          {_.times(12, (i) => {
            return (
              <div key={i} className="background__result column_result"/>
            );
          })}
        {this.props.sidebar ? <div className="column_sidebar"/> : null}
      </div>
    );
  }
});

BackgroundLabels = React.createClass({
  render() {
    return (
      <div className="background-labels container row">
          <div className="column_details"/>
          {_.times(12, (i) => {
            return (
              <div key={i} className="background-labels__result column_result">
                <p className="background-labels__label">{moment(i + 1, 'M').format('MMM')}</p>
              </div>
            );
          })}
        {this.props.sidebar ? <div className="column_sidebar"/> : null}
      </div>
    );
  }
});
