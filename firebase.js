// web/src/services/firebase.js
// Firebase web SDK initialization

import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Set up invisible reCAPTCHA verifier (required for phone auth)
 * @param {string} containerId - DOM element ID for reCAPTCHA
 */
export const setupRecaptcha = (containerId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {},
  });
  return window.recaptchaVerifier;
};

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - E.164 format e.g. +919876543210
 */
export const sendOTP = async (phoneNumber) => {
  const appVerifier = setupRecaptcha('recaptcha-container');
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  window.confirmationResult = confirmationResult;
  return confirmationResult;
};

/**
 * Verify OTP entered by user
 * @param {string} otp - 6-digit code
 */
export const verifyOTP = async (otp) => {
  const result = await window.confirmationResult.confirm(otp);
  return result.user;
};