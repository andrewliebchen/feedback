/**
 * @jsx React.DOM
 */

AddEmployee = React.createClass({
  getInitialState() {
    return {
      menu: false
    };
  },

  handleMenuToggle() {
    this.setState({menu: !this.state.menu});
  },

  handleAddSeedEmployee() {
    $.ajax({
      url: 'http://api.randomuser.me/',
      dataType: 'json',
      success: (data) => {
        let randomUser = data.results[0].user;
        let newEmployee = {
          username: randomUser.username,
          email: randomUser.email,
          password: randomUser.password,
          organization: Meteor.user().profile.organization,
          name: `${randomUser.name.first} ${randomUser.name.last}`,
          imageSrc: randomUser.picture.large,
          teams: ['Team 1']
        };

        Meteor.call('newEmployee', newEmployee);
        this.setState({menu: !this.state.menu});
      }
    });
  },

  toggleNewEmployee() {
    // FlowRouter.setQueryParams({
    //   show: 'new_employee'
    // });
    this.setState({menu: !this.state.menu});
  },

  render() {
    return (
      <div className="header__add-user">
        <a className="btn btn-primary" onClick={this.handleMenuToggle}>✚</a>
        {this.state.menu ?
          <Menu toggle={this.handleMenuToggle}>
            <MenuItem handleClick={this.handleAddSeedEmployee}>Add seed employee</MenuItem>
            <MenuItem handleClick={this.toggleNewEmployee}>Add real employee</MenuItem>
          </Menu>
        : null}
      </div>
    );
  }
});
