/**
 * @jsx React.DOM
 */

var _ = lodash;

Avatar = React.createClass({
  render() {
    return (
      <div className="media">
        <div className="media-left">
          <img src={this.props.employee.picture.thumbnail} className="img-rounded" width="24"/>
        </div>
        <div className="media-body">
          {`${_.capitalize(this.props.employee.name.first)} ${_.capitalize(this.props.employee.name.last)}`}
        </div>
      </div>
    );
  }
})
