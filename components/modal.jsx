/**
 * @jsx React.DOM
 */

Modal = React.createClass({
  render() {
    return (
      <div className="modal" style={{display: 'block'}}>
        <div className="modal-dialog">
          <div className="modal-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});
