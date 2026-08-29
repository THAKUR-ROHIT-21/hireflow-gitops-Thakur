const {
  User,
  Job,
  Application,
  Interview,
  InterviewFeedback,
  CandidateProfile,
  InterviewRound
} = require("../models");

const { Op } = require("sequelize");

/*
|--------------------------------------------------------------------------
| HR DASHBOARD
|--------------------------------------------------------------------------
*/

async function hrDashboard(req, res) {
  try {
    const companyId = req.user.companyId;

    console.log("========================================");
    console.log("HR DASHBOARD REQUEST");
    console.log("HR user ID:", req.user.id);
    console.log("HR company ID:", companyId);
    console.log("========================================");

    /*
    |--------------------------------------------------------------------------
    | Fetch all registered candidates
    |--------------------------------------------------------------------------
    |
    | Candidate registration creates:
    |
    | users
    |   └── candidate
    |
    | candidate_profiles
    |   └── user_id
    |
    | We therefore fetch candidates directly from User.
    |
    */

    const candidatesPromise = User.findAll({
      where: {
        role: "candidate"
      },

      attributes: [
        "id",
        "fullName",
        "email",
        "status",
        "createdAt"
      ],

      include: [
        {
          model: CandidateProfile,
          as: "candidateProfile",
          required: false,

          attributes: [
            "id",
            "desiredRole",
            "phone",
            "location",
            "resumeUrl",
            "linkedinUrl",
            "githubUrl",
            "bio"
          ]
        }
      ],

      order: [["createdAt", "DESC"]]
    });

    /*
    |--------------------------------------------------------------------------
    | Open jobs belonging to this HR company
    |--------------------------------------------------------------------------
    */

    const openJobsPromise = Job.count({
      where: {
        companyId,
        status: "open"
      }
    });

    /*
    |--------------------------------------------------------------------------
    | Upcoming interviews belonging to this HR company
    |--------------------------------------------------------------------------
    */

    const upcomingInterviewsPromise = Interview.findAll({
      where: {
        status: {
          [Op.in]: ["scheduled", "rescheduled"]
        },

        scheduledAt: {
          [Op.gte]: new Date()
        }
      },

      include: [
        {
          model: Application,
          as: "application",
          required: true,

          include: [
            {
              model: User,
              as: "candidate",

              attributes: [
                "id",
                "fullName",
                "email"
              ]
            },

            {
              model: Job,
              as: "job",

              where: {
                companyId
              },

              attributes: [
                "id",
                "title"
              ]
            }
          ]
        },

        {
          model: InterviewRound,
          as: "round",
          required: false,

          attributes: [
            "id",
            "name",
            "roundOrder",
            "interviewType"
          ]
        }
      ],

      order: [
        ["scheduledAt", "ASC"]
      ],

      limit: 10
    });

    /*
    |--------------------------------------------------------------------------
    | Completed interviews waiting for feedback
    |--------------------------------------------------------------------------
    */

    const pendingFeedbackPromise =
      Interview.findAll({
        where: {
          status: "completed"
        },

        include: [
          {
            model: Application,
            as: "application",
            required: true,

            include: [
              {
                model: Job,
                as: "job",

                where: {
                  companyId
                },

                attributes: [
                  "id",
                  "title"
                ]
              }
            ]
          },

          {
            model: InterviewFeedback,
            as: "feedback",
            required: false
          }
        ],

        limit: 50
      });

    /*
    |--------------------------------------------------------------------------
    | Execute database queries
    |--------------------------------------------------------------------------
    */

    const [
      candidates,
      openJobs,
      upcomingInterviews,
      pendingFeedback
    ] = await Promise.all([
      candidatesPromise,
      openJobsPromise,
      upcomingInterviewsPromise,
      pendingFeedbackPromise
    ]);

    /*
    |--------------------------------------------------------------------------
    | Debug database truth
    |--------------------------------------------------------------------------
    */

    console.log(
      "Registered candidates:",
      candidates.length
    );

    console.log(
      "Candidate records:",
      candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.fullName,
        email: candidate.email,
        status: candidate.status,
        profile: candidate.candidateProfile
          ? {
              desiredRole:
                candidate.candidateProfile
                  .desiredRole,

              location:
                candidate.candidateProfile
                  .location
            }
          : null
      }))
    );

    console.log(
      "Open jobs:",
      openJobs
    );

    console.log(
      "Upcoming interviews:",
      upcomingInterviews.length
    );

    const feedbackPendingCount =
      pendingFeedback.filter(
        (interview) =>
          !interview.feedback
      ).length;

    console.log(
      "Pending feedback:",
      feedbackPendingCount
    );

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.json({
      stats: {
        candidates: candidates.length,

        openJobs,

        upcomingInterviews:
          upcomingInterviews.length,

        pendingFeedback:
          feedbackPendingCount
      },

      candidates,

      upcomingInterviews
    });
  } catch (error) {
    console.error(
      "HR DASHBOARD ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      message:
        "Unable to load HR dashboard"
    });
  }
}

/*
|--------------------------------------------------------------------------
| CANDIDATE DASHBOARD
|--------------------------------------------------------------------------
*/

async function candidateDashboard(req, res) {
  try {
    const candidateId = req.user.id;

    console.log(
      "Candidate dashboard user:",
      candidateId
    );

    const applications =
      await Application.findAll({
        where: {
          candidateId
        },

        include: [
          {
            model: Job,
            as: "job",

            attributes: [
              "id",
              "title",
              "department",
              "location",
              "employmentType",
              "status"
            ]
          },

          {
            model: InterviewRound,
            as: "currentRound",

            attributes: [
              "id",
              "name",
              "roundOrder",
              "interviewType"
            ]
          },

          {
            model: Interview,
            as: "interviews",

            separate: true,

            order: [
              ["scheduledAt", "DESC"]
            ],

            include: [
              {
                model: InterviewRound,
                as: "round",

                attributes: [
                  "id",
                  "name",
                  "roundOrder",
                  "interviewType"
                ]
              },

              {
                model: InterviewFeedback,
                as: "feedback",

                required: false
              }
            ]
          }
        ],

        order: [
          ["appliedAt", "DESC"]
        ]
      });

    console.log(
      "Candidate applications:",
      applications.length
    );

    return res.json({
      applications
    });
  } catch (error) {
    console.error(
      "CANDIDATE DASHBOARD ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      message:
        "Unable to load candidate dashboard"
    });
  }
}

module.exports = {
  hrDashboard,
  candidateDashboard
};