Meteor.startup(function () {
  smtp = {
    username: Meteor.settings.sendgrid.username,
    password: Meteor.settings.sendgrid.password,
    host: Meteor.settings.sendgrid.host
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.host);
});
