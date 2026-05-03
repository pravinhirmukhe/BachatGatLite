// web/src/i18n/index.js
// Multi-language support: English, Marathi, Hindi

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      app_name: 'BachatGat',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Something went wrong',
      success: 'Success',
      amount: 'Amount (₹)',
      name: 'Name',
      mobile: 'Mobile Number',
      submit: 'Submit',
      back: 'Back',
      // Auth
      login_title: 'Welcome to BachatGat',
      enter_mobile: 'Enter Mobile Number',
      send_otp: 'Send OTP',
      enter_otp: 'Enter OTP',
      verify_otp: 'Verify OTP',
      // Dashboard
      dashboard: 'Dashboard',
      total_savings: 'Total Savings',
      active_loans: 'Active Loans',
      total_members: 'Total Members',
      pending_payments: 'Pending Payments',
      // Groups
      my_groups: 'My Groups',
      create_group: 'Create Group',
      group_name: 'Group Name',
      monthly_amount: 'Monthly Contribution (₹)',
      meeting_day: 'Meeting Day',
      // Members
      members: 'Members',
      add_member: 'Add Member',
      remove_member: 'Remove Member',
      total_saved: 'Total Saved',
      outstanding_loan: 'Outstanding Loan',
      // Savings
      savings: 'Savings',
      record_payment: 'Record Payment',
      payment_status: 'Payment Status',
      paid: 'Paid',
      unpaid: 'Unpaid',
      // Loans
      loans: 'Loans',
      give_loan: 'Give Loan',
      repay_loan: 'Record Repayment',
      interest_rate: 'Interest Rate (% / month)',
      tenure: 'Tenure (months)',
      emi: 'Monthly EMI',
      outstanding: 'Outstanding',
      closed: 'Closed',
      active: 'Active',
    },
  },

  mr: {
    translation: {
      // Common
      app_name: 'बचत गट',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      loading: 'लोड होत आहे...',
      error: 'काहीतरी चुकले',
      success: 'यशस्वी',
      amount: 'रक्कम (₹)',
      name: 'नाव',
      mobile: 'मोबाईल नंबर',
      submit: 'सबमिट करा',
      back: 'मागे',
      // Auth
      login_title: 'बचत गट मध्ये स्वागत आहे',
      enter_mobile: 'मोबाईल नंबर टाका',
      send_otp: 'OTP पाठवा',
      enter_otp: 'OTP टाका',
      verify_otp: 'OTP तपासा',
      // Dashboard
      dashboard: 'डॅशबोर्ड',
      total_savings: 'एकूण बचत',
      active_loans: 'सक्रिय कर्ज',
      total_members: 'एकूण सदस्य',
      pending_payments: 'थकलेले हप्ते',
      // Groups
      my_groups: 'माझे गट',
      create_group: 'नवीन गट बनवा',
      group_name: 'गटाचे नाव',
      monthly_amount: 'मासिक वर्गणी (₹)',
      meeting_day: 'बैठकीचा दिवस',
      // Members
      members: 'सदस्य',
      add_member: 'सदस्य जोडा',
      remove_member: 'सदस्य काढा',
      total_saved: 'एकूण बचत',
      outstanding_loan: 'बाकी कर्ज',
      // Savings
      savings: 'बचत',
      record_payment: 'पेमेंट नोंदवा',
      payment_status: 'पेमेंट स्थिती',
      paid: 'भरले',
      unpaid: 'थकीत',
      // Loans
      loans: 'कर्ज',
      give_loan: 'कर्ज द्या',
      repay_loan: 'परतफेड नोंदवा',
      interest_rate: 'व्याज दर (% / महिना)',
      tenure: 'कालावधी (महिने)',
      emi: 'मासिक हप्ता',
      outstanding: 'बाकी',
      closed: 'बंद',
      active: 'सक्रिय',
    },
  },

  hi: {
    translation: {
      // Common
      app_name: 'बचत गट',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हुआ',
      success: 'सफल',
      amount: 'राशि (₹)',
      name: 'नाम',
      mobile: 'मोबाइल नंबर',
      submit: 'जमा करें',
      back: 'वापस',
      // Auth
      login_title: 'बचत गट में आपका स्वागत है',
      enter_mobile: 'मोबाइल नंबर दर्ज करें',
      send_otp: 'OTP भेजें',
      enter_otp: 'OTP दर्ज करें',
      verify_otp: 'OTP सत्यापित करें',
      // Dashboard
      dashboard: 'डैशबोर्ड',
      total_savings: 'कुल बचत',
      active_loans: 'सक्रिय ऋण',
      total_members: 'कुल सदस्य',
      pending_payments: 'लंबित भुगतान',
      // Groups
      my_groups: 'मेरे समूह',
      create_group: 'समूह बनाएं',
      group_name: 'समूह का नाम',
      monthly_amount: 'मासिक योगदान (₹)',
      meeting_day: 'बैठक का दिन',
      // Members
      members: 'सदस्य',
      add_member: 'सदस्य जोड़ें',
      remove_member: 'सदस्य हटाएं',
      total_saved: 'कुल बचत',
      outstanding_loan: 'बकाया ऋण',
      // Savings
      savings: 'बचत',
      record_payment: 'भुगतान दर्ज करें',
      payment_status: 'भुगतान स्थिति',
      paid: 'भुगतान',
      unpaid: 'बकाया',
      // Loans
      loans: 'ऋण',
      give_loan: 'ऋण दें',
      repay_loan: 'पुनर्भुगतान दर्ज करें',
      interest_rate: 'ब्याज दर (% / माह)',
      tenure: 'अवधि (महीने)',
      emi: 'मासिक किस्त',
      outstanding: 'बकाया',
      closed: 'बंद',
      active: 'सक्रिय',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'mr', // Default: Marathi
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;