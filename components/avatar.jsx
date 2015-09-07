/**
 * @jsx React.DOM
 */

const _ = lodash;

Avatar = React.createClass({
  propTypes: {
    employee: React.PropTypes.object,
    className: React.PropTypes.string
  },

  handleClick() {
    FlowRouter.setQueryParams({
      show: this.props.employee._id
    });
  },

  render() {
    let profile = this.props.employee.profile;
    return (
      <a className={`avatar media ${this.props.className}`} onClick={this.handleClick}>
        {profile.imageSrc ?
          <div className="avatar__image media-left">
            <img src={profile.imageSrc} width="24"/>
          </div>
        : null}
        <div className="avatar__body media-body">{_.startCase(profile.name)}</div>
      </a>
    );
  }
})
