/**
 * @jsx React.DOM
 */

ImageUploader = React.createClass({
  handleImageUpload(event) {
    var uploader = new Slingshot.Upload('fileUploads');
    uploader.send(event.target.files[0], (error, imageSrc) => {
      if (error) {
        console.error('Error uploading', uploader.xhr.response);
      }
      else {
        Meteor.call('updateImage', {
          id: this.props.employeeId,
          imageSrc: imageSrc
        });
      }
    });
  },

  render() {
    return (
      <div className="form-group">
        <input
          type="file"
          className="form-control"
          onChange={this.handleImageUpload}/>
      </div>
    );
  }
});


if(Meteor.isServer) {
  Meteor.methods({
    'updateImage': function(args) {
      Meteor.users.update(args.id, {
        $set: {
          'profile.imageSrc': args.imageSrc
        }
      })
    }
  });
}
