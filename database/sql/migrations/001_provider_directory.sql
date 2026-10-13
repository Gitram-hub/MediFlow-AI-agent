USE healthcare;

ALTER TABLE hospitals
    ADD COLUMN IF NOT EXISTS approval_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE doctors
    ADD COLUMN IF NOT EXISTS qualifications VARCHAR(255),
    ADD COLUMN IF NOT EXISTS contact_number VARCHAR(30),
    ADD COLUMN IF NOT EXISTS approval_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE availability_slots
    ADD COLUMN IF NOT EXISTS status ENUM('available', 'blocked') NOT NULL DEFAULT 'available';

ALTER TABLE appointments
    ADD COLUMN IF NOT EXISTS status ENUM('booked', 'cancelled', 'completed') NOT NULL DEFAULT 'booked';

UPDATE specialists SET name = 'Cardiology' WHERE name = 'Cardiologist';
UPDATE specialists SET name = 'General Medicine' WHERE name = 'Physician';
UPDATE doctors SET specialization = 'Cardiology' WHERE specialization = 'Cardiologist';
UPDATE doctors SET specialization = 'General Medicine' WHERE specialization = 'Physician';

CREATE UNIQUE INDEX uq_hospitals_name ON hospitals (name);
CREATE UNIQUE INDEX uq_doctors_contact ON doctors (contact_number);
CREATE INDEX idx_doctors_directory
    ON doctors (specialization, approval_status, is_active);

CREATE INDEX idx_slots_availability
    ON availability_slots (doctor_id, available_date, status);

CREATE UNIQUE INDEX uq_appointments_slot_active
    ON appointments (slot_id, status);
