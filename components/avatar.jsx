/**
 * @jsx React.DOM
 */

const _ = lodash;

Avatar = React.createClass({
  render() {
    let profile = this.props.employee.profile;
    return (
      <a href={`/employees/${this.props.employee._id}`} className="avatar media">
        {profile.imageSrc ?
          <div className="media-left">
            <img src={profile.imageSrc} className="img-rounded" width="24"/>
          </div>
        : null}
        <div className="media-body">{_.capitalize(profile.name)}</div>
      </a>
    );
  }
})
