/**
 * @jsx React.DOM
 */

const _ = lodash;

// Store sidebar state in Query?
Layout = React.createClass({
  render() {
    return (
      <div className="container">
        <Header session/>
        {this.props.content}
      </div>
    );
  }
});
