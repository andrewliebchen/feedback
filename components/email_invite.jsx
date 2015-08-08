/**
 * @jsx React.DOM
 */

EmailInvite = React.createClass({
  sendInviteEmail(event) {
    Meteor.call('sendInviteEmail', {
      to: React.findDOMNode(this.refs.to).value,
      message: React.findDOMNode(this.refs.message).value
    });
  },

  render() {
    return (
      <div>
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
      </div>
    );
  }
});

if (Meteor.isServer) {
  Meteor.methods({
    'sendInviteEmail': function(args) {
      Email.send({
        from: 'andrewliebchen@gmail.com',
        to: args.to,
        subject: 'Create your profile on Feedback',
        text: args.message
      });
    }
  });
}
