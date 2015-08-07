// Slingshot AWs fil restrictions
Slingshot.fileRestrictions('fileUploads', {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
});

// Feedback session CRON job
SyncedCron.add({
  name: 'Build feedback sessions',
  schedule: function(parser) {
    return parser.recur().every(1).month().onWeekday().on('18:00:00').time();
  },

  job: function() {
    Meteor.call('createFeedbackSessions');
  }
});

SyncedCron.start();
