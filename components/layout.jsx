/**
 * @jsx React.DOM
 */

const _ = lodash;

LayoutNarrow = React.createClass({
  render() {
    return (
      <div className="container container_narrow">
        {this.props.content}
      </div>
    );
  }
});

LayoutWide = React.createClass({
  render() {
    return (
      <div className="container container_wide">
        <Header session/>
        {this.props.content}
      </div>
    );
  }
});
