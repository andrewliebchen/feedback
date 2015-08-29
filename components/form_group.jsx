/**
 * @jsx React.DOM
 */

const _ = lodash;

FormGroup = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  render() {
    return (
      <div className="form-group">
        <label>{this.props.label}</label>
        <input
          type="text"
          className="form-control"
          value={this.props.value}
          onChange={this.props.onChange}/>
      </div>
    );
  }
});
