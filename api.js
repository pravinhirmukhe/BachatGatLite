// web/src/services/api.js
// Axios instance with auth token injection

import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Inject Firebase ID token on every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data);
export const getMyProfile = () => api.get('/auth/me');
export const updateProfile = (data) => api.patch('/auth/me', data);

// ─── Groups ──────────────────────────────────────────────────────────────────
export const createGroup = (data) => api.post('/groups', data);
export const getMyGroups = () => api.get('/groups');
export const getGroup = (groupId) => api.get(`/groups/${groupId}`);
export const updateGroup = (groupId, data) => api.patch(`/groups/${groupId}`, data);

// ─── Members ─────────────────────────────────────────────────────────────────
export const addMember = (data) => api.post('/members', data);
export const getGroupMembers = (groupId) => api.get(`/members?groupId=${groupId}`);
export const removeMember = (memberId) => api.patch(`/members/${memberId}/remove`);

// ─── Savings ─────────────────────────────────────────────────────────────────
export const recordSaving = (data) => api.post('/savings', data);
export const getGroupSavings = (groupId, year, monthIndex) =>
  api.get(`/savings?groupId=${groupId}&year=${year}&monthIndex=${monthIndex}`);
export const getMemberSavings = (memberId, year) =>
  api.get(`/savings/member?memberId=${memberId}&year=${year}`);
export const getPendingSavings = (groupId, year, monthIndex) =>
  api.get(`/savings/pending?groupId=${groupId}&year=${year}&monthIndex=${monthIndex}`);

// ─── Loans ───────────────────────────────────────────────────────────────────
export const issueLoan = (data) => api.post('/loans', data);
export const recordRepayment = (loanId, data) => api.post(`/loans/${loanId}/repay`, data);
export const getGroupLoans = (groupId, status) =>
  api.get(`/loans?groupId=${groupId}${status ? `&status=${status}` : ''}`);
export const getLoanDetails = (loanId) => api.get(`/loans/${loanId}`);

export default api;