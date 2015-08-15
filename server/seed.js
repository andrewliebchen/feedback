function createAdmin() {
  return Accounts.createUser({
    username: 'admin',
    email : 'admin@example.com',
    password : 'password',
    profile: {
      organization: '',
      teams: ['Team 1'],
      name: 'Manuela Velasco',
      imageSrc: 'http://api.randomuser.me/portraits/women/39.jpg'
    }
  });
}

function createTeam() {
  return Teams.insert({
    name: 'Team 1',
    organization: '',
    createdAt: Date.now()
  });
}

Meteor.startup(function() {
  if(Organizations.find().count() === 0) {
    var seedAdmin = createAdmin();
    var seedTeam = createTeam();

    Roles.addUsersToRoles(seedAdmin, ['admin'])

    Organizations.insert({
      name: 'Weyland-Yutani Corp.',
      domain: 'example.com',
      createdAt: Date.now(),
      feedback: {
        status: true,
        frequency: 'Monthly'
      },
    }, function(error, result) {
      Meteor.users.update(seedAdmin, {
        $set: {
          'profile.organization': result
        }
      });
      Teams.update(seedTeam, {
        $set: {
          organization: result
        }
      });
    });
  }
});
