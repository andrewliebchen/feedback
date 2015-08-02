/**
 * @jsx React.DOM
 */

var _ = lodash;

Avatar = React.createClass({
  render() {
    var profile = this.props.employee.profile;
    return (
      <a href={`/employees/${this.props.employee._id}`} className="avatar media">
        {profile.picture.thumbnail ?
          <div className="media-left">
            <img src={profile.picture.thumbnail} className="img-rounded" width="24"/>
          </div>
        : null}
        <div className="media-body">{_.capitalize(profile.name)}</div>
      </a>
    );
  }
})
