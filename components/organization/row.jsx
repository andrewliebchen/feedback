/**
 * @jsx React.DOM
 */

const _ = lodash;

OrganizationRow = React.createClass({
  handleViewOrganization() {
    FlowRouter.setQueryParams({
      show: 'organization',
      id: this.props.organization._id
    });
  },

  render() {
    return (
      <section className="organization row">
        <div className="column_details">
          <h3 className="row__title" onClick={this.handleViewOrganization}>
            {this.props.organization.name}
          </h3>
        </div>
        <div className="row__results column_results">
          {/* Organization-wide results */}
        </div>
      </section>
    );
  }
});
