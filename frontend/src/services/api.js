const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export function getFederatedStatus() {
  return apiRequest("/api/federated/status");
}

export function getGlobalModelEvaluation() {
  return apiRequest("/api/federated/evaluation");
}

export function getLogisticRegressionBaseline() {
  return apiRequest("/api/baselines/logistic-regression");
}

export function getRandomForestBaseline() {
  return apiRequest("/api/baselines/random-forest");
}

export function uploadHospitalCSVs(files) {
  const form = new FormData();
  form.append("hospital_a", files.hospital_a);
  form.append("hospital_b", files.hospital_b);
  form.append("hospital_c", files.hospital_c);
  return apiRequest("/api/federated/upload", { method: "POST", body: form });
}

export function startFederatedTraining(rounds = 3) {
  return apiRequest(`/api/federated/train?rounds=${rounds}`, { method: "POST" });
}

export function federatedPrediction(features) {
  return apiRequest("/api/federated/predict", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(features),
  });
}

export async function loginUser(loginData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
}
