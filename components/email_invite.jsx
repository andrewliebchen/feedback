/**
 * @jsx React.DOM
 */

EmailInvite = React.createClass({
  sendInviteEmail(event) {
    let message = `${React.findDOMNode(this.refs.message).value} Visit http://${Meteor.settings.public.siteURL}/${this.props.organization._id}/employees/new to sign up!`
    Meteor.call('sendInviteEmail', {
      to: React.findDOMNode(this.refs.to).value,
      subject: React.findDOMNode(this.refs.subject).value,
      message: message
    });
  },

  render() {
    return (
      <form className="panel panel-default">
        <header className="panel-heading">
          <h4 className="panel-title">Invite</h4>
        </header>
        <div className="panel-body">
          <div className="form-group">
            <label>To</label>
            <input
              type="text"
              className="form-control"
              placeholder="Seperate each address by a comma"
              ref="to"/>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              className="form-control"
              defaultValue="Create your profile on Feedback"
              ref="subject"/>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              className="form-control"
              defaultValue="Sign up for this service or you're fired."
              ref="message"/>
          </div>
        </div>
        <footer className="panel-footer">
          <input
            type="submit"
            className="btn btn-primary"
            onSubmit={this.sendInviteEmail}
            value="Send"/>
        </footer>
      </form>
    );
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    'sendInviteEmail': function(args) {
      // Will need to verify/sanitize the fields

      // Don't block while the email is sending
      this.unblock();

      // Send the email, fix the address eventually
      Email.send({
        from: 'andrewliebchen@gmail.com',
        to: args.to,
        subject: args.subject,
        text: args.message
      });
    }
  });
}
