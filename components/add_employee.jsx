/**
 * @jsx React.DOM
 */

AddEmployee = React.createClass({
  getInitialState() {
    return {
      menu: false,
      newEmployee: false
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

  showNewEmployeeModal() {
    FlowRouter.setQueryParams({
      show: 'new_employee'
    });
    this.setState({newEmployee: true});
    this.setState({menu: false});
  },

  hideNewEmployeeModal() {
    FlowRouter.setQueryParams({
      show: null
    });
    this.setState({newEmployee: false});
  },

  render() {
    return (
      <div className="header__add-user">
        <a className="btn btn-primary" onClick={this.handleMenuToggle}>✚</a>
        {this.state.menu ?
          <Menu toggle={this.handleMenuToggle}>
            <MenuItem handleClick={this.handleAddSeedEmployee}>Add seed employee</MenuItem>
            <MenuItem handleClick={this.showNewEmployeeModal}>Add real employee</MenuItem>
          </Menu>
        : null}

        {this.state.newEmployee ?
          <div className="modal__wrapper">
            <div className="modal panel">
              <NewEmployeeForm
                organization={Organizations.findOne()}
                teams={Teams.find().fetch()}/>
            </div>
            <div className="modal__background" onClick={this.hideNewEmployeeModal}/>
            <div className="modal__actions">
              <a className="modal__action modal__action_close btn btn-primary" onClick={this.hideNewEmployeeModal}>X</a>
            </div>
          </div>
        : null}
      </div>
    );
  }
});
