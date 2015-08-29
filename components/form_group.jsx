/**
 * @jsx React.DOM
 */

const _ = lodash;

FormGroup = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    type: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      type: "text"
    };
  },

  render() {
    return (
      <div className="form-group">
        <label>{this.props.label}</label>
        <input
          type={this.props.type}
          className="form-control"
          defaultValue={this.props.defaultValue}
          onChange={this.props.onChange}/>
      </div>
    );
  }
});
