var _ = lodash;

createFeedbackSession = function(employees, currentEmployee, month) {
  var weightedEmployees = [];

  // Shuffle the list of employees, then apply a weight
  _.shuffle(employees).map(function(employee) {
    var weightedEmployee = {};

    // Weighted factors
    var onSameTeam = _.intersection(employee.profile.teams, currentEmployee.profile.teams).length > 0;

    // Construct collection
    if(employee._id != currentEmployee._id) {
      if(onSameTeam) {
        weightedEmployee = {
          'id': employee._id,
          'value': 1
        };
      } else {
        weightedEmployee = {
          'id': employee._id,
          'value': 0
        };
      }
      return weightedEmployees.push(weightedEmployee);
    }
  });

  // Sort the collection by weight, take the top 5
  var feedbackGroup = _.take(_.sortByOrder(weightedEmployees, 'value', 'dsc'), 5);

  // Get the ids of the top 5
  var feedbackGroupIds = _.pluck(feedbackGroup, 'id');

  // Insert document into the FeedbackSessions collection
  return FeedbackSessions.insert({
    organization: currentEmployee.profile.organization,
    for: currentEmployee._id,
    employees: feedbackGroupIds,
    year: moment().format('YYYY'),
    month: month,
    complete: false
  });
}
