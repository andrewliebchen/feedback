/**
 * @jsx React.DOM
 */

Menu = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    toggle: React.PropTypes.func
  },

  render() {
    return (
      <span>
        <div className={`menu ${this.props.className}`}>
          {this.props.children}
        </div>
        <div className="menu__background" onClick={this.props.toggle}/>
      </span>
    );
  }
});

MenuItem = React.createClass({
  render() {
    return (
      <a className="menu__item" onClick={this.props.handleClick}>{this.props.children}</a>
    );
  }
})
