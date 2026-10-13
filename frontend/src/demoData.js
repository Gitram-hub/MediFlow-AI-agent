const getDateAfterToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const DEMO_USER = {
  userId: 1,
  patientId: 1,
  email: "demo@mediflow.local",
  password: "demo",
};

export const DEMO_PATIENT = {
  name: "Aarav Mehta",
  date_of_birth: "1994-06-12",
  gender: "Male",
  contact_number: "+91 90000 00000",
  medical_record_number: "DEMO-001",
  blood_group: "O+",
  marital_status: "Single",
  id: DEMO_USER.patientId,
};

export const DEMO_HISTORY = {
  past_diagnoses: "Seasonal allergies",
  surgeries: "None",
  hospital_admissions: "None",
  immunization_records: "COVID-19 and annual flu vaccine",
  family_medical_history: "None reported",
  lifestyle_factors: "Active lifestyle",
};

export const DEMO_RECOMMENDATION = {
  phrases: ["mild chest discomfort", "occasional fatigue"],
  normalized_symptoms: ["Chest discomfort", "Fatigue"],
  specialists: ["Cardiology", "General Medicine"],
  recommended_specialists: ["Cardiology", "General Medicine"],
  doctors: [
    {
      doctor_id: 9001,
      slot_id: 99001,
      name: "Dr. Asha Sharma",
      specialization: "Cardiology",
      hospital: "City Care Hospital",
      rating: 4.8,
      fees: 800,
      next_available_date: getDateAfterToday(1),
      start_time: "10:30:00",
      end_time: "11:00:00",
    },
    {
      doctor_id: 9002,
      slot_id: 99002,
      name: "Dr. Rahul Mehta",
      specialization: "General Medicine",
      hospital: "Wellness Medical Center",
      rating: 4.6,
      fees: 600,
      next_available_date: getDateAfterToday(2),
      start_time: "14:00:00",
      end_time: "14:30:00",
    },
  ],
};
