/**
 * @jsx React.DOM
 */

Login = React.createClass({
  getInitialState() {
    return {
      showPassword: false
    };
  },

  handleLogin(event) {
    event.preventDefault();
    // retrieve the input field values
    let email = React.findDOMNode(this.refs.email).value
    let password = React.findDOMNode(this.refs.password).value;

    // Trim and validate your fields here....

    Meteor.loginWithPassword(email, password, function(err) {
      if(err){

      } else {
        FlowRouter.go('/admin');
      }
    });
  },

  handleTogglePassword() {
    this.setState({showPassword: !this.state.showPassword});
  },

  render() {
    return (
      <div className="container login">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <Header/>
            <form className="panel panel-default panel-body" action="action">
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" ref="email"/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="input-group">
                  <input type={this.state.showPassword ? 'text' : 'password'} className="form-control" ref="password"/>
                  <div className="input-group-addon" onClick={this.handleTogglePassword}>
                    {this.state.showPassword ? 'hide' : 'show'}
                  </div>
                </div>
              </div>
              <input type="submit" className="btn btn-primary" value="Sign in" onClick={this.handleLogin}/>
             </form>
           </div>
         </div>
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/login', {
    action: function(param) {
      ReactLayout.render(Login);
    }
  });
}
