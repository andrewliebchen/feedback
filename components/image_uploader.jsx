/**
 * @jsx React.DOM
 */

ImageUploader = React.createClass({
  propTypes: {
    id: React.PropTypes.string
  },

  handleImageUpload(event) {
    let uploader = new Slingshot.Upload('fileUploads');
    uploader.send(event.target.files[0], (error, imageSrc) => {
      if (error) {
        console.error('Error uploading', uploader.xhr.response);
      }
      else {
        Meteor.call('updateImage', {
          id: this.props.id,
          imageSrc: imageSrc
        });
      }
    });
  },

  render() {
    return (
      <div className="form-group image-uploader">
        <input
          type="file"
          className="form-control"
          onChange={this.handleImageUpload}
          disabled={!this.props.id}/>
      </div>
    );
  }
});


if(Meteor.isServer) {
  Meteor.methods({
    'updateImage': function(args) {
      return Meteor.users.update(args.id, {
        $set: {
          'profile.imageSrc': args.imageSrc
        }
      })
    }
  });
}
