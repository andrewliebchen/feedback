/**
 * @jsx React.DOM
 */

const _ = lodash;

Background = React.createClass({
  render() {
    return (
      <div className="background container_wide row">
          <div className="column_details"/>
          {_.times(12, (i) => {
            return (
              <div key={i} className="background__result column_result"/>
            );
          })}
      </div>
    );
  }
});

BackgroundLabels = React.createClass({
  render() {
    return (
      <div className="background background-labels container_wide row">
          <div className="column_details"/>
          {_.times(12, (i) => {
            return (
              <div key={i} className="background-labels__result column_result">
                <p className="background-labels__label">{moment(i + 1, 'M').format('MMM')}</p>
              </div>
            );
          })}
      </div>
    );
  }
});
