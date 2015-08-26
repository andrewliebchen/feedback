/**
 * @jsx React.DOM
 */

 const trimInput = function(val) {
   return val.replace(/^\s*|\s*$/g, "");
 }

Login = React.createClass({
  mixins: [ShowPasswordMixin],

  getInitialState() {
    return {
      alert: null
    };
  },

  handleLogin(event) {
    event.preventDefault();
    // retrieve the input field values
    let email = trimInput(React.findDOMNode(this.refs.email).value);
    let password = React.findDOMNode(this.refs.password).value;

    Meteor.loginWithPassword(email, password, (err) => {
      if(err){
        console.log('whoops')
        this.setState({alert: "Whoops, something went wrong! Please try again..."})
      } else {
        FlowRouter.go('/');
      }
    });
  },

  render() {
    return (
      <div className="container login">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <Header/>
            {this.state.alert ?
              <div className="alert alert-danger" role="alert">{this.state.alert}</div>
            : null}
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
