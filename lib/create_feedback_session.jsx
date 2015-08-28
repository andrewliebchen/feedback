const _ = lodash;

createFeedbackSession = function(employees, currentEmployee, month) {
  let weightedEmployees = [];

  // Shuffle the list of employees, then apply a weight
  _.shuffle(employees).map(function(employee) {
    let weightedEmployee = {};

    // Weighted factors
    let onSameTeam = _.intersection(employee.profile.teams, currentEmployee.profile.teams).length > 0;

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
  let feedbackGroup = _.take(_.sortByOrder(weightedEmployees, 'value', 'dsc'), 5);

  // Get the ids of the top 5
  let feedbackGroupIds = _.pluck(feedbackGroup, 'id');

  // Insert document into the FeedbackSessions collection
  let feedbackSessionId = FeedbackSessions.insert({
    organization: currentEmployee.profile.organization,
    for: currentEmployee._id,
    employees: feedbackGroupIds,
    year: moment().format('YYYY'),
    month: month,
    complete: false
  });

  // Send email to recipient

  // Send the email, fix the address eventually
  // Email.send({
  //   from: 'andrewliebchen@gmail.com',
  //   to: currentEmployee.emails[0].address,
  //   subject: 'Time to do you feedback session',
  //   text: `http://${Meteor.settings.public.siteURL}/feedbacks/${feedbackSessionId}`
  // });

  return feedbackSessionId;
}
