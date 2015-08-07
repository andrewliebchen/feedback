/**
 * @jsx React.DOM
 */

OrganizationList = React.createClass({
  getInitialState() {
    return {
      editOrganization: false
    };
  },

  handleOrganizationEditToggle() {
    this.setState({editOrganization: !this.state.editOrganization})
  },

  render() {
    return (
      <div className="panel panel-default">
        <header className="panel-heading">
          <h3 className="panel-title">Organization</h3>
        </header>
        <table className="table">
          <tbody>
            <tr>
              <td>{this.props.organization.name}</td>
              <td>
                <button
                  className="btn btn-default btn-sm pull-right"
                  onClick={this.handleOrganizationEditToggle}>
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {this.state.editOrganization ?
          <Modal>
            <div>
              <div className="modal-header">
                <button>&times;</button>
                <h4 className="modal-title">Modal title</h4>
              </div>
              <div className="modal-body">
                <p>One fine body&hellip;</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-default">Close</button>
                <button className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </Modal>
        : null}
      </div>
    );
  }
});
