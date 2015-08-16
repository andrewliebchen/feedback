/**
 * @jsx React.DOM
 */

const _ = lodash;

Avatar = React.createClass({
  handleClick() {
    FlowRouter.setQueryParams({
      show: 'employee',
      id: this.props.employee._id
    });
  },

  render() {
    let profile = this.props.employee.profile;
    return (
      <a className="avatar media" onClick={this.handleClick}>
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
