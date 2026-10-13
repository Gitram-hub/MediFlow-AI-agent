DROP PROCEDURE IF EXISTS sp_create_appointment;
DELIMITER //

CREATE PROCEDURE sp_create_appointment(
    IN p_patient_id INT,
    IN p_doctor_id INT,
    IN p_slot_id INT,
    IN p_reason TEXT
)
BEGIN
    DECLARE v_patient_exists INT DEFAULT 0;
    DECLARE v_slot_exists INT DEFAULT 0;
    DECLARE v_slot_booked INT DEFAULT 0;

    SELECT COUNT(*) INTO v_patient_exists
    FROM patients
    WHERE id = p_patient_id;

    IF v_patient_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient does not exist';
    END IF;

    SELECT COUNT(*) INTO v_slot_exists
    FROM availability_slots a
    INNER JOIN doctors d ON d.id = a.doctor_id
    INNER JOIN hospitals h ON h.id = d.hospital_id
    WHERE a.id = p_slot_id
      AND a.doctor_id = p_doctor_id
      AND a.status = 'available'
      AND a.available_date >= CURRENT_DATE()
      AND d.approval_status = 'approved'
      AND d.is_active = TRUE
      AND h.approval_status = 'approved'
      AND h.is_active = TRUE;

    IF v_slot_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Doctor or appointment slot is unavailable';
    END IF;

    SELECT COUNT(*) INTO v_slot_booked
    FROM appointments
    WHERE slot_id = p_slot_id
      AND status = 'booked';

    IF v_slot_booked > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment slot is already booked';
    END IF;

    INSERT INTO appointments (patient_id, doctor_id, slot_id, reason)
    VALUES (p_patient_id, p_doctor_id, p_slot_id, p_reason);

    UPDATE availability_slots
    SET status = 'blocked'
    WHERE id = p_slot_id;

    SELECT LAST_INSERT_ID() AS appointment_id;
END //

DELIMITER ;
