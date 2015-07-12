// var _ = lodash;

// if(Meteor.isClient) {
//   _.times(10, function(){
//     $.ajax({
//       url: 'http://api.randomuser.me/',
//       dataType: 'json',
//       success: function(data){
//         Meteor.call('seedEmployees', data);
//       }
//     });
//   });
// }


// if(Meteor.isServer) {
//   Meteor.methods({
//     'seedEmployees': function(data) {
//       Employees.insert(data.results[0].user);
//     }
//   });
// }
