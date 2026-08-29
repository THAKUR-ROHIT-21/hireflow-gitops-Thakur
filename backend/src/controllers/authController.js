const bcrypt = require("bcrypt");
const { User, Company, CandidateProfile } = require("../models");
const { sequelize } = require("../config/database");
const { signToken, publicUser } = require("../utils/auth");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isUniqueConstraintError(error) {
  return (
    error?.name === "SequelizeUniqueConstraintError" ||
    error?.original?.code === "23505"
  );
}

async function registerHR(req, res) {
  const { name, company, email, password } = req.body;

  if (!name || !company || !email || !password) {
    return res.status(400).json({
      message: "Name, company, email and password are required"
    });
  }

  if (String(password).length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }

  const normalizedEmail = normalizeEmail(email);
  const trimmedName = String(name).trim();
  const trimmedCompany = String(company).trim();

  if (!normalizedEmail || !trimmedName || !trimmedCompany) {
    return res.status(400).json({
      message: "Name, company and email cannot be empty"
    });
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const existing = await User.findOne({
        where: {
          email: normalizedEmail
        },
        transaction
      });

      if (existing) {
        const error = new Error("Email is already registered");
        error.code = "EMAIL_ALREADY_REGISTERED";
        throw error;
      }

      const companyRecord = await Company.create(
        {
          name: trimmedCompany
        },
        {
          transaction
        }
      );

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create(
        {
          fullName: trimmedName,
          email: normalizedEmail,
          passwordHash,
          role: "hr",
          companyId: companyRecord.id
        },
        {
          transaction
        }
      );

      return {
        user,
        token: signToken(user)
      };
    });

    return res.status(201).json({
      user: publicUser(result.user),
      token: result.token
    });
  } catch (error) {
    console.error("HR registration failed:", error);

    if (
      error?.code === "EMAIL_ALREADY_REGISTERED" ||
      isUniqueConstraintError(error)
    ) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    return res.status(500).json({
      message: "Unable to create HR account"
    });
  }
}

async function registerCandidate(req, res) {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({
      message: "Name, email, role and password are required"
    });
  }

  if (String(password).length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }

  const normalizedEmail = normalizeEmail(email);
  const trimmedName = String(name).trim();
  const trimmedRole = String(role).trim();

  if (!normalizedEmail || !trimmedName || !trimmedRole) {
    return res.status(400).json({
      message: "Name, email and role cannot be empty"
    });
  }

  try {
    const result = await sequelize.transaction(async (transaction) => {
      const existing = await User.findOne({
        where: {
          email: normalizedEmail
        },
        transaction
      });

      if (existing) {
        const error = new Error("Email is already registered");
        error.code = "EMAIL_ALREADY_REGISTERED";
        throw error;
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await User.create(
        {
          fullName: trimmedName,
          email: normalizedEmail,
          passwordHash,
          role: "candidate"
        },
        {
          transaction
        }
      );

      await CandidateProfile.create(
        {
          userId: user.id,
          desiredRole: trimmedRole
        },
        {
          transaction
        }
      );

      return {
        user,
        token: signToken(user)
      };
    });

    return res.status(201).json({
      user: publicUser(result.user),
      token: result.token
    });
  } catch (error) {
    console.error("Candidate registration failed:", error);

    if (
      error?.code === "EMAIL_ALREADY_REGISTERED" ||
      isUniqueConstraintError(error)
    ) {
      return res.status(409).json({
        message: "Email is already registered"
      });
    }

    return res.status(500).json({
      message: "Unable to create candidate account"
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return res.status(400).json({
      message: "Email is required"
    });
  }

  try {
    const user = await User.findOne({
      where: {
        email: normalizedEmail
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account is not active"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    return res.status(200).json({
      user: publicUser(user),
      token: signToken(user)
    });
  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      message: "Login failed"
    });
  }
}

module.exports = {
  registerHR,
  registerCandidate,
  login
};
