Meteor.startup(function () {
  process.env.MAIL_URL = `smtp://${SENDGRID.username}:${SENDGRID.password}@${SENDGRID.host}`;
});
