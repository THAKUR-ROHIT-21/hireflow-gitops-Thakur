const API_URL = (() => {
  const configuredURL =
    import.meta.env.VITE_API_URL?.trim();

  if (configuredURL) {
    return configuredURL.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
})();

/*
|--------------------------------------------------------------------------
| REQUEST HELPER
|--------------------------------------------------------------------------
*/

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("hireflow_token");

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const url = `${API_URL}${normalizedEndpoint}`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("API request failed:", {
      url,
      error,
    });

    throw new Error(
      "Unable to connect to the HireFlow server."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RESPONSE PARSING
  |--------------------------------------------------------------------------
  */

  let data = {};

  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  }

  /*
  |--------------------------------------------------------------------------
  | AUTHENTICATION FAILURE
  |--------------------------------------------------------------------------
  */

  if (response.status === 401) {
    throw new Error(
      data?.message ||
        "Your session has expired. Please sign in again."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | OTHER API ERRORS
  |--------------------------------------------------------------------------
  */

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/

/**
 * Register HR account.
 */
export const registerHR = (formData) =>
  request("/api/auth/register/hr", {
    method: "POST",

    body: JSON.stringify({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      password: formData.password,
    }),
  });

/**
 * Register candidate account.
 */
export const registerCandidate = (formData) =>
  request("/api/auth/register/candidate", {
    method: "POST",

    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    }),
  });

/**
 * Login.
 */
export const login = (email, password) =>
  request("/api/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });

/*
|--------------------------------------------------------------------------
| DASHBOARDS
|--------------------------------------------------------------------------
*/

/**
 * HR dashboard.
 */
export const getHRDashboard = () =>
  request("/api/dashboard/hr");

/**
 * Candidate dashboard.
 */
export const getCandidateDashboard = () =>
  request("/api/dashboard/candidate");

/*
|--------------------------------------------------------------------------
| CANDIDATES
|--------------------------------------------------------------------------
*/

/**
 * Get candidates.
 */
export const getCandidates = () =>
  request("/api/candidates");

/**
 * Get a single candidate.
 */
export const getCandidate = (id) =>
  request(`/api/candidates/${id}`);

/*
|--------------------------------------------------------------------------
| JOBS
|--------------------------------------------------------------------------
*/

/**
 * Get jobs.
 */
export const getJobs = () =>
  request("/api/jobs");

/**
 * Get a single job.
 */
export const getJob = (id) =>
  request(`/api/jobs/${id}`);

/**
 * Create job.
 */
export const createJob = (data) =>
  request("/api/jobs", {
    method: "POST",

    body: JSON.stringify(data),
  });

/**
 * Update job.
 */
export const updateJob = (id, data) =>
  request(`/api/jobs/${id}`, {
    method: "PATCH",

    body: JSON.stringify(data),
  });

/**
 * Update job status.
 */
export const updateJobStatus = (id, status) =>
  request(`/api/jobs/${id}/status`, {
    method: "PATCH",

    body: JSON.stringify({
      status,
    }),
  });

/*
|--------------------------------------------------------------------------
| INTERVIEWS
|--------------------------------------------------------------------------
*/

/**
 * Get interviews.
 */
export const getInterviews = () =>
  request("/api/interviews");

/**
 * Get single interview.
 */
export const getInterview = (id) =>
  request(`/api/interviews/${id}`);

/**
 * Create interview.
 */
export const createInterview = (data) =>
  request("/api/interviews", {
    method: "POST",

    body: JSON.stringify(data),
  });

/**
 * Update interview.
 */
export const updateInterview = (id, data) =>
  request(`/api/interviews/${id}`, {
    method: "PATCH",

    body: JSON.stringify(data),
  });

/**
 * Update interview status.
 */
export const updateInterviewStatus = (
  id,
  status
) =>
  request(`/api/interviews/${id}/status`, {
    method: "PATCH",

    body: JSON.stringify({
      status,
    }),
  });

/*
|--------------------------------------------------------------------------
| INTERVIEW FEEDBACK
|--------------------------------------------------------------------------
*/

/**
 * Submit interview feedback.
 */
export const submitInterviewFeedback = (
  interviewId,
  data
) =>
  request(
    `/api/interviews/${interviewId}/feedback`,
    {
      method: "POST",

      body: JSON.stringify(data),
    }
  );

/**
 * Get interview feedback.
 */
export const getInterviewFeedback = (
  interviewId
) =>
  request(
    `/api/interviews/${interviewId}/feedback`
  );

/*
|--------------------------------------------------------------------------
| CANDIDATE STATUS
|--------------------------------------------------------------------------
*/

/**
 * Update candidate stage/status.
 */
export const updateCandidateStatus = (
  id,
  status
) =>
  request(`/api/candidates/${id}/status`, {
    method: "PATCH",

    body: JSON.stringify({
      status,
    }),
  });

/*
|--------------------------------------------------------------------------
| AUTH STORAGE
|--------------------------------------------------------------------------
*/

/**
 * Save authenticated session.
 */
export function saveAuth(data) {
  if (!data?.token) {
    throw new Error(
      "Authentication response does not contain a token."
    );
  }

  localStorage.setItem(
    "hireflow_token",
    data.token
  );

  if (data.user) {
    localStorage.setItem(
      "hireflow_user",
      JSON.stringify(data.user)
    );
  }
}

/**
 * Get stored user safely.
 */
export function getStoredUser() {
  const user = localStorage.getItem(
    "hireflow_user"
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error(
      "Invalid stored user data:",
      error
    );

    localStorage.removeItem(
      "hireflow_user"
    );

    return null;
  }
}

/**
 * Get JWT token.
 */
export function getToken() {
  return localStorage.getItem(
    "hireflow_token"
  );
}

/**
 * Check whether user is authenticated.
 */
export function isAuthenticated() {
  return Boolean(getToken());
}

/**
 * Clear authentication session.
 */
export function logout() {
  localStorage.removeItem(
    "hireflow_token"
  );

  localStorage.removeItem(
    "hireflow_user"
  );
}

/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

/**
 * Backend + PostgreSQL health check.
 */
export const checkAPI = () =>
  request("/api/health");

/*
|--------------------------------------------------------------------------
| API CONFIG
|--------------------------------------------------------------------------
*/

/**
 * Get resolved API base URL.
 *
 * Development:
 *   VITE_API_URL=http://localhost:3000
 *
 * Production:
 *   Uses current browser origin automatically.
 */
export function getAPIUrl() {
  return API_URL;
}
