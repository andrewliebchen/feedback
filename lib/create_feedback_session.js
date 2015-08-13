var _ = lodash;

createFeedbackSession = function(employees, currentEmployee, month) {
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
    for: currentEmployee._id,
    employees: _.take(_.shuffle(teamEmployeeIds), 4).concat(_.take(_.shuffle(otherEmployeeIds), 1)),
    year: moment().format('YYYY'),
    month: month,
    complete: false
  });
}
