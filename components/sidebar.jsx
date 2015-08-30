/**
 * @jsx React.DOM
 */

const _ = lodash;
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

Sidebar = React.createClass({
  render() {
    return (
      <aside className="sidebar column_sidebar">
        <div className="sidebar__container">
          {this.props.children}
        </div>
      </aside>
    );
  }
});
