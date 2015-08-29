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
      <section className="organization-list">
        <div className="column_details">
          <Card
            className="row__card"
            name={this.props.organization.name}
            image={this.props.organization.imageSrc}
            handleClick={this.handleViewOrganization}/>
        </div>
        <div className="row__results column_results">
          {/* Organization-wide results */}
        </div>
      </section>
    );
  }
});
