/**
 * @jsx React.DOM
 */

const _ = lodash;

Layout = React.createClass({
  render() {
    return (
      <div className="container">
        <Header session/>
        {this.props.content}
        <Sidebar/>
      </div>
    );
  }
});
