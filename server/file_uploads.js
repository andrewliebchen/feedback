Slingshot.createDirective('fileUploads', Slingshot.S3Storage, {
  bucket: Meteor.settings.AWSBucketName,
  acl: 'public-read',

  authorize: function () {
    if (!this.userId) {
      throw new Meteor.Error(403, "Login Required");
     }

    return true;
  },
  key: function (file) {
    return file.name;
  }
});
