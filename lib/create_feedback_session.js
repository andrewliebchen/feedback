createFeedbackSession = function(employees, currentEmployee) {
  var teamEmployeeIds = [];
  var otherEmployeeIds = [];

  // For each employee, create a feedback session
  employees.map(function(employee) {
    if(employee._id !== currentEmployee._id) {
      if(_.intersection(employee.profile.teams, currentEmployee.profile.teams).length > 0) {
        return teamEmployeeIds.push(employee._id);
      } else {
        return otherEmployeeIds.push(employee._id);
      }
    }
  });

  return FeedbackSessions.insert({
    organization: currentEmployee.profile.organization,
    respondant: currentEmployee._id,
    employees: _.take(_.shuffle(teamEmployeeIds), 4).concat(_.take(_.shuffle(otherEmployeeIds), 1)),
    period: moment().format('M')
  });
}
