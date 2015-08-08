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
      imageSrc: "http://api.randomuser.me/portraits/women/39.jpg"
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
      feedback: {
        status: true,
        frequency: 'Monthly'
      },
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
