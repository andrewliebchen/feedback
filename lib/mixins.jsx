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
