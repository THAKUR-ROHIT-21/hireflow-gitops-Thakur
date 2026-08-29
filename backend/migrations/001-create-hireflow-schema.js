const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
    );

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_users_role" AS ENUM ('hr', 'candidate');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_users_status" AS ENUM ('active', 'inactive', 'suspended');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_jobs_status" AS ENUM ('draft', 'open', 'closed', 'archived');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_applications_status" AS ENUM (
          'applied','screening','technical','final','offer','hired','rejected','withdrawn'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_interview_rounds_interview_type" AS ENUM (
          'screening','technical','behavioral','final','hr'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_interviews_status" AS ENUM (
          'scheduled','rescheduled','cancelled','completed','no_show'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_interviews_interview_type" AS ENUM (
          'screening','technical','behavioral','final','hr'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        CREATE TYPE "enum_interview_feedback_recommendation" AS ENUM (
          'strong_yes','yes','neutral','no','strong_no'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryInterface.createTable("companies", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      email: DataTypes.STRING(255),
      website: DataTypes.STRING(255),
      industry: DataTypes.STRING(100),
      description: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("users", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      role: { type: "enum_users_role", allowNull: false },
      status: { type: "enum_users_status", allowNull: false, defaultValue: "active" },
      full_name: { type: DataTypes.STRING(150), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password_hash: { type: DataTypes.TEXT, allowNull: false },
      company_id: {
        type: DataTypes.UUID,
        references: { model: "companies", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("candidate_profiles", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      desired_role: DataTypes.STRING(150),
      phone: DataTypes.STRING(30),
      location: DataTypes.STRING(150),
      resume_url: DataTypes.TEXT,
      linkedin_url: DataTypes.TEXT,
      github_url: DataTypes.TEXT,
      bio: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("jobs", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "companies", key: "id" },
        onDelete: "CASCADE"
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "RESTRICT"
      },
      title: { type: DataTypes.STRING(150), allowNull: false },
      department: DataTypes.STRING(100),
      location: DataTypes.STRING(150),
      employment_type: DataTypes.STRING(50),
      description: DataTypes.TEXT,
      requirements: DataTypes.TEXT,
      status: { type: "enum_jobs_status", allowNull: false, defaultValue: "draft" },
      opened_at: DataTypes.DATE,
      closed_at: DataTypes.DATE,
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("interview_rounds", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "jobs", key: "id" },
        onDelete: "CASCADE"
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      round_order: { type: DataTypes.INTEGER, allowNull: false },
      interview_type: { type: "enum_interview_rounds_interview_type", allowNull: false },
      description: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("applications", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE"
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "jobs", key: "id" },
        onDelete: "CASCADE"
      },
      current_round_id: {
        type: DataTypes.UUID,
        references: { model: "interview_rounds", key: "id" },
        onDelete: "SET NULL"
      },
      status: {
        type: "enum_applications_status",
        allowNull: false,
        defaultValue: "applied"
      },
      applied_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.addConstraint("applications", {
      fields: ["candidate_id", "job_id"],
      type: "unique",
      name: "applications_candidate_job_unique"
    });

    await queryInterface.createTable("interviewers", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE"
      },
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "companies", key: "id" },
        onDelete: "CASCADE"
      },
      title: DataTypes.STRING(100),
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("interviews", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      application_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "applications", key: "id" },
        onDelete: "CASCADE"
      },
      round_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "interview_rounds", key: "id" },
        onDelete: "RESTRICT"
      },
      interviewer_id: {
        type: DataTypes.UUID,
        references: { model: "interviewers", key: "id" },
        onDelete: "SET NULL"
      },
      scheduled_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "RESTRICT"
      },
      title: { type: DataTypes.STRING(150), allowNull: false },
      interview_type: { type: "enum_interviews_interview_type", allowNull: false },
      scheduled_at: { type: DataTypes.DATE, allowNull: false },
      duration_minutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },
      meeting_url: DataTypes.TEXT,
      status: { type: "enum_interviews_status", allowNull: false, defaultValue: "scheduled" },
      candidate_notes: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("interview_feedback", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      interview_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: "interviews", key: "id" },
        onDelete: "CASCADE"
      },
      interviewer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "interviewers", key: "id" },
        onDelete: "RESTRICT"
      },
      rating: DataTypes.INTEGER,
      recommendation: { type: "enum_interview_feedback_recommendation", allowNull: false },
      strengths: DataTypes.TEXT,
      weaknesses: DataTypes.TEXT,
      comments: DataTypes.TEXT,
      submitted_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("application_status_history", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      application_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "applications", key: "id" },
        onDelete: "CASCADE"
      },
      old_status: DataTypes.STRING(30),
      new_status: { type: DataTypes.STRING(30), allowNull: false },
      changed_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "RESTRICT"
      },
      notes: DataTypes.TEXT,
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });

    await queryInterface.createTable("notifications", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.literal("gen_random_uuid()"), primaryKey: true },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE"
      },
      title: { type: DataTypes.STRING(200), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("notifications");
    await queryInterface.dropTable("application_status_history");
    await queryInterface.dropTable("interview_feedback");
    await queryInterface.dropTable("interviews");
    await queryInterface.dropTable("interviewers");
    await queryInterface.dropTable("applications");
    await queryInterface.dropTable("interview_rounds");
    await queryInterface.dropTable("jobs");
    await queryInterface.dropTable("candidate_profiles");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("companies");

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_interview_feedback_recommendation";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_interviews_interview_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_interviews_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_interview_rounds_interview_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_applications_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_jobs_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  }
};
