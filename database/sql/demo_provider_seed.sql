USE healthcare;

-- Fictional, rerunnable provider data for local development only.
-- These records are approved so the recommendation flow can be demonstrated.

INSERT INTO hospitals
    (name, address, contact_number, website, approval_status, is_active)
VALUES
    ('Demo City Care Hospital', '12 Sunrise Avenue, Pune', '+91-90000-10001', 'https://demo-city-care.invalid', 'approved', TRUE),
    ('Demo Wellness Medical Center', '44 Lake Road, Bengaluru', '+91-90000-10002', 'https://demo-wellness.invalid', 'approved', TRUE),
    ('Demo Family Health Hospital', '8 Green Park, Jaipur', '+91-90000-10003', 'https://demo-family-health.invalid', 'approved', TRUE)
ON DUPLICATE KEY UPDATE
    address = VALUES(address),
    contact_number = VALUES(contact_number),
    website = VALUES(website),
    approval_status = 'approved',
    is_active = TRUE;

INSERT INTO doctors
    (name, specialization, qualifications, experience, rating, fees, hospital_id, contact_number, approval_status, is_active)
SELECT provider.name, provider.specialization, provider.qualifications, provider.experience,
       provider.rating, provider.fees, h.id, provider.contact_number, 'approved', TRUE
FROM (
    SELECT 'Dr. Asha Sharma' name, 'Cardiology' specialization, 'MBBS, MD Cardiology' qualifications, 14 experience, 4.8 rating, 800 fees, 'Demo City Care Hospital' hospital_name, '+91-90000-20001' contact_number
    UNION ALL SELECT 'Dr. Rahul Mehta', 'General Medicine', 'MBBS, MD Medicine', 11, 4.7, 600, 'Demo Wellness Medical Center', '+91-90000-20002'
    UNION ALL SELECT 'Dr. Kavya Nair', 'Neurology', 'MBBS, DM Neurology', 16, 4.9, 1100, 'Demo City Care Hospital', '+91-90000-20003'
    UNION ALL SELECT 'Dr. Isha Kapoor', 'Dermatology', 'MBBS, MD Dermatology', 9, 4.6, 550, 'Demo Wellness Medical Center', '+91-90000-20004'
    UNION ALL SELECT 'Dr. Arjun Rao', 'Orthopedics', 'MBBS, MS Orthopedics', 13, 4.8, 900, 'Demo Family Health Hospital', '+91-90000-20005'
    UNION ALL SELECT 'Dr. Meera Joshi', 'Pediatrics', 'MBBS, MD Pediatrics', 10, 4.7, 650, 'Demo Family Health Hospital', '+91-90000-20006'
    UNION ALL SELECT 'Dr. Nandita Sen', 'Gynecology', 'MBBS, MS Gynecology', 12, 4.8, 850, 'Demo City Care Hospital', '+91-90000-20007'
    UNION ALL SELECT 'Dr. Vikram Das', 'Psychiatry', 'MBBS, MD Psychiatry', 15, 4.6, 750, 'Demo Wellness Medical Center', '+91-90000-20008'
    UNION ALL SELECT 'Dr. Rohan Iyer', 'Pulmonology', 'MBBS, MD Pulmonology', 12, 4.7, 800, 'Demo City Care Hospital', '+91-90000-20009'
    UNION ALL SELECT 'Dr. Sana Ali', 'Gastroenterology', 'MBBS, DM Gastroenterology', 14, 4.9, 950, 'Demo Family Health Hospital', '+91-90000-20010'
) provider
INNER JOIN hospitals h ON h.name = provider.hospital_name
ON DUPLICATE KEY UPDATE
    qualifications = VALUES(qualifications),
    experience = VALUES(experience),
    rating = VALUES(rating),
    fees = VALUES(fees),
    hospital_id = VALUES(hospital_id),
    contact_number = VALUES(contact_number),
    approval_status = 'approved',
    is_active = TRUE;

INSERT INTO availability_slots (doctor_id, available_date, start_time, end_time, status)
SELECT d.id, DATE_ADD(CURRENT_DATE(), INTERVAL offsets.day_offset DAY),
       offsets.start_time, offsets.end_time, 'available'
FROM doctors d
JOIN (
    SELECT 1 day_offset, '09:00:00' start_time, '09:30:00' end_time
    UNION ALL SELECT 2, '11:00:00', '11:30:00'
    UNION ALL SELECT 3, '14:00:00', '14:30:00'
) offsets
WHERE d.contact_number LIKE '+91-90000-2%'
  AND NOT EXISTS (
      SELECT 1
      FROM availability_slots existing
      WHERE existing.doctor_id = d.id
        AND existing.available_date = DATE_ADD(CURRENT_DATE(), INTERVAL offsets.day_offset DAY)
        AND existing.start_time = offsets.start_time
  );
