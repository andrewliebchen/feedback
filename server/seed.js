function createAdmin() {
  return Accounts.createUser({
    username: "heavybutterfly920",
    email : "manuela.velasco50@example.com",
    password : "password",
    profile: {
      organization: "",
      team: "",
      gender: "female",
      name: {
        first: "manuela",
        last: "velasco"
      },
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
      createdAt: Date.now(),
      admin: seedAdmin
    }, function(error, result){
      Meteor.users.update(seedAdmin, {
        $set: {
          "profile.organization": result
        }
      });
    });
  }
});
