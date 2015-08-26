/**
 * @jsx React.DOM
 */

ImageUploader = React.createClass({
  propTypes: {
    id: React.PropTypes.string
  },

  handleImageUpload(files) {
    let uploader = new Slingshot.Upload('fileUploads');
    let file = files[0];

    uploader.send(file, (error, imageSrc) => {
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
      <Dropzone
        onDrop={this.handleImageUpload}
        multiple={false}
        accept="image/*"
        style={{height: "auto", width: "100%"}}/>
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
