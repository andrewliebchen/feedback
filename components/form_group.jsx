/**
 * @jsx React.DOM
 */

FormGroup = React.createClass({
  getDefaultProps() {
    return {
      type: 'text'
    };
  },

  render() {
    return (
      <div className="form-group">
        <label>{this.props.label}</label>
        <input
          ref={this.props.refString}
          className="form-control"
          type={this.props.type}
          defaultValue={this.props.defaultValue}/>
      </div>
    );
  }
});
