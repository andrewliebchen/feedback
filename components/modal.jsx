/**
 * @jsx React.DOM
 */

Modal = React.createClass({
  propTypes: {
    close: React.PropTypes.func.isRequired
  },

  renderContent() {
    let id = FlowRouter.getQueryParam('show');

    if(Meteor.users.findOne(id)) {
      let employeeId = Meteor.users.findOne(id)._id;
      return <EmployeeProfile id={employeeId}/>;
    } else {
      return <OrganizationProfile/>;
    }
  },

  render() {
    return (
      <div className="modal__wrapper">
        <div className="modal panel">
          {this.renderContent()}
        </div>
        <div className="modal__background" onClick={this.props.close}/>
        <div className="modal__actions">
          <a className="modal__action modal__action_close btn btn-primary" onClick={this.props.close}>X</a>
          <a className="modal__action btn btn-primary">prev</a>
          <a className="modal__action btn btn-primary">next</a>
        </div>
      </div>
    );
  }
});
