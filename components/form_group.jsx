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
        {this.props.label ?
          <label>{this.props.label}</label>
        : null}
        <input
          className="form-control"
          type={this.props.type}
          defaultValue={this.props.defaultValue}/>
      </div>
    );
  }
});
