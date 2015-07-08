if(Meteor.isClient) {
  if(Employees.find().count() === 0) {
    _.times(10, function(){
      $.ajax({
        url: 'http://api.randomuser.me/',
        dataType: 'json',
        success: function(data){
          Employees.insert(data.results[0].user);
        }
      });
    });
  }
}
