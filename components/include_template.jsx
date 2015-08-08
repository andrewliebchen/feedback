/**
 * @jsx React.DOM
 */

IncludeTemplate = React.createClass({
  componentDidMount() {
    let componentRoot = React.findDOMNode(this);
    let parentNode = componentRoot.parentNode;
    parentNode.removeChild(componentRoot);

    return Blaze.render(this.props.template, parentNode);
  },

  render(template) {
    return <div/>;
  }
});
