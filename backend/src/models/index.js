const User = require("./User");
const Company = require("./Company");
const CandidateProfile = require("./CandidateProfile");
const Job = require("./Job");
const InterviewRound = require("./InterviewRound");
const Application = require("./Application");
const Interviewer = require("./Interviewer");
const Interview = require("./Interview");
const InterviewFeedback = require("./InterviewFeedback");
const ApplicationStatusHistory = require("./ApplicationStatusHistory");
const Notification = require("./Notification");

// Company relationships
Company.hasMany(User, { foreignKey: "companyId", as: "users" });
User.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Company.hasMany(Job, { foreignKey: "companyId", as: "jobs" });
Job.belongsTo(Company, { foreignKey: "companyId", as: "company" });

Company.hasMany(Interviewer, { foreignKey: "companyId", as: "interviewers" });
Interviewer.belongsTo(Company, { foreignKey: "companyId", as: "company" });

// Candidate
User.hasOne(CandidateProfile, { foreignKey: "userId", as: "candidateProfile" });
CandidateProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

// Jobs
User.hasMany(Job, { foreignKey: "createdBy", as: "createdJobs" });
Job.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

Job.hasMany(InterviewRound, { foreignKey: "jobId", as: "rounds" });
InterviewRound.belongsTo(Job, { foreignKey: "jobId", as: "job" });

// Applications
User.hasMany(Application, { foreignKey: "candidateId", as: "applications" });
Application.belongsTo(User, { foreignKey: "candidateId", as: "candidate" });

Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

Application.belongsTo(InterviewRound, {
  foreignKey: "currentRoundId",
  as: "currentRound"
});

InterviewRound.hasMany(Application, {
  foreignKey: "currentRoundId",
  as: "currentApplications"
});

// Interviewers
User.hasOne(Interviewer, { foreignKey: "userId", as: "interviewerProfile" });
Interviewer.belongsTo(User, { foreignKey: "userId", as: "user" });

// Interviews
Application.hasMany(Interview, {
  foreignKey: "applicationId",
  as: "interviews"
});
Interview.belongsTo(Application, {
  foreignKey: "applicationId",
  as: "application"
});

InterviewRound.hasMany(Interview, {
  foreignKey: "roundId",
  as: "interviews"
});
Interview.belongsTo(InterviewRound, {
  foreignKey: "roundId",
  as: "round"
});

Interviewer.hasMany(Interview, {
  foreignKey: "interviewerId",
  as: "interviews"
});
Interview.belongsTo(Interviewer, {
  foreignKey: "interviewerId",
  as: "interviewer"
});

User.hasMany(Interview, {
  foreignKey: "scheduledBy",
  as: "scheduledInterviews"
});
Interview.belongsTo(User, {
  foreignKey: "scheduledBy",
  as: "scheduler"
});

// Feedback
Interview.hasOne(InterviewFeedback, {
  foreignKey: "interviewId",
  as: "feedback"
});
InterviewFeedback.belongsTo(Interview, {
  foreignKey: "interviewId",
  as: "interview"
});

Interviewer.hasMany(InterviewFeedback, {
  foreignKey: "interviewerId",
  as: "feedback"
});
InterviewFeedback.belongsTo(Interviewer, {
  foreignKey: "interviewerId",
  as: "interviewer"
});

// Status history
Application.hasMany(ApplicationStatusHistory, {
  foreignKey: "applicationId",
  as: "statusHistory"
});
ApplicationStatusHistory.belongsTo(Application, {
  foreignKey: "applicationId",
  as: "application"
});

User.hasMany(ApplicationStatusHistory, {
  foreignKey: "changedBy",
  as: "statusChanges"
});
ApplicationStatusHistory.belongsTo(User, {
  foreignKey: "changedBy",
  as: "changedByUser"
});

// Notifications
User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications"
});
Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user"
});

module.exports = {
  User,
  Company,
  CandidateProfile,
  Job,
  InterviewRound,
  Application,
  Interviewer,
  Interview,
  InterviewFeedback,
  ApplicationStatusHistory,
  Notification
};
