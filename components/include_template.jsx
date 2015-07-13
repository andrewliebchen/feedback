/**
 * @jsx React.DOM
 */

IncludeTemplate = React.createClass({
  componentDidMount() {
    var componentRoot = React.findDOMNode(this);
    var parentNode = componentRoot.parentNode;
    parentNode.removeChild(componentRoot);

    return Blaze.render(this.props.template, parentNode);
  },

  render(template) {
    return <div/>;
  }
});
