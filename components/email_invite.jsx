/**
 * @jsx React.DOM
 */

EmailInvite = React.createClass({
  getInitialState() {
    return {
      emailInviteModal: false
    };
  },

  sendInviteEmail(event) {
    let message = `${React.findDOMNode(this.refs.message).value} Visit http://${Meteor.settings.public.siteURL}/${this.props.organizationId}/employees/new to sign up!`
    Meteor.call('sendInviteEmail', {
      to: React.findDOMNode(this.refs.to).value,
      subject: React.findDOMNode(this.refs.subject).value,
      message: message
    });
    this.setState({emailInviteModal: false});
  },

  toggleEmailInvite() {
    this.setState({emailInviteModal: !this.state.emailInviteModal});
  },

  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.toggleEmailInvite}>
          Email invite
        </button>

        {this.state.emailInviteModal ?
          <Modal close={this.toggleEmailInvite}>
            <header className="modal-header">
              <h4 className="modal-title">Invite</h4>
            </header>
            <div className="modal-body">
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
            <footer className="modal-footer">
              <button className="btn btn-primary" onClick={this.sendInviteEmail}>Send</button>
            </footer>
          </Modal>
        : null}
      </div>
    );
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    'sendInviteEmail': function(args) {
      // Will need to verify/sanitize the feilds

      // Don't block while the email is sending
      this.unblock();

      // Send the email
      Email.send({
        from: 'andrewliebchen@gmail.com',
        to: args.to,
        subject: args.subject,
        text: args.message
      });
    }
  });
}
