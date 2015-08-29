/**
 * @jsx React.DOM
 */

if(Meteor.isClient) {
  Session.setDefault('newImageUrl', null);
}

ImageUploader = React.createClass({
  propTypes: {
    destination: React.PropTypes.string,
    id: React.PropTypes.string
  },

  handleImageUpload(files) {
    let file = files[0];
    let uploader = new Slingshot.Upload('fileUploads');

    // If an id is passed to the component, we're editing an existing
    // user's profile. If not, we're creating a new one. Since an id
    // doesn't exist yet, put it in a Session variable for use later.
    uploader.send(file, (error, imageSrc) => {
      if (error) {
        console.error('Error uploading', uploader.xhr.response);
      }
      else {
        if(this.props.id) {
          Meteor.call('updateImage', {
            destination: this.props.destination,
            id: this.props.id,
            imageSrc: imageSrc
          });
        } else {
          Session.set('newImageUrl', imageSrc);
        }
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
      if(args.destination === 'employee') {
        return Meteor.users.update(args.id, {
          $set: {'profile.imageSrc': args.imageSrc}
        });
      }

      if(args.destination === 'organization') {
        return Organizations.update(args.id, {
          $set: {imageSrc: args.imageSrc}
        });
      }
    }
  });
}
