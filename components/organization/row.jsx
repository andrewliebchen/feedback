/**
 * @jsx React.DOM
 */

const _ = lodash;

OrganizationRow = React.createClass({
  render() {
    return (
      <section className="organization">
        <div className="column_details" onClick={this.props.showDetail.bind(null, 'organization', this.props.organization._id)}>
          <Card
            className="row__card"
            name={this.props.organization.name}
            image={this.props.organization.imageSrc}/>
        </div>
        <div className="row__results column_results">
          {/* Organization-wide results */}
        </div>
      </section>
    );
  }
});
