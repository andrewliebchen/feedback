Meteor.startup(function () {
  smtp = {
    username: Meteor.settings.sendgrid.username,
    password: Meteor.settings.sendgrid.password,
    host: Meteor.settings.sendgrid.host
  }

  process.env.MAIL_URL = 'smtp://' + smtp.username + ':' + smtp.password + '@' + smtp.host;
});
