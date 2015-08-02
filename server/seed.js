function createAdmin() {
  return Accounts.createUser({
    username: "admin",
    email : "admin@example.com",
    password : "password",
    profile: {
      organization: "",
      teams: [],
      gender: "female",
      name: "Manuela Velasco",
      picture: {
        large: "http://api.randomuser.me/portraits/women/39.jpg",
        medium: "http://api.randomuser.me/portraits/med/women/39.jpg",
        thumbnail: "http://api.randomuser.me/portraits/thumb/women/39.jpg"
      }
    }
  });
}

Meteor.startup(function() {
  if(Organizations.find().count() === 0) {
    var seedAdmin = createAdmin();

    Organizations.insert({
      name: 'Weyland-Yutani Corp.',
      domain: 'example.com',
      createdAt: Date.now(),
      admin: seedAdmin,
      teams: ['Team 1', 'Team 2', 'Team 3']
    }, function(error, result){
      Meteor.users.update(seedAdmin, {
        $set: {
          "profile.organization": result
        }
      });
    });
  }
});
