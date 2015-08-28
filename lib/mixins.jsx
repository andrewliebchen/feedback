ShowPasswordMixin = {
  getInitialState() {
    return {
      showPassword: false
    };
  },

  handleTogglePassword() {
    this.setState({showPassword: !this.state.showPassword});
  },
};

RowActionsMixin = {
  getInitialState() {
    return {
      actions: false
    };
  },

  handleToggleActions() {
    this.setState({actions: !this.state.actions});
  },
};
