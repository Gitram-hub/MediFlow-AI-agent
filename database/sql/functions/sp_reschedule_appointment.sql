DROP PROCEDURE IF EXISTS sp_reschedule_appointment;
DELIMITER //

CREATE PROCEDURE sp_reschedule_appointment(
    IN p_patient_id INT,
    IN p_appointment_id INT,
    IN p_new_slot_id INT
)
BEGIN
    DECLARE v_new_slot_available INT DEFAULT 0;
    DECLARE v_updated INT DEFAULT 0;

    SELECT COUNT(*) INTO v_new_slot_available
    FROM availability_slots s
    LEFT JOIN appointments booked
        ON booked.slot_id = s.id AND booked.status = 'booked'
    WHERE s.id = p_new_slot_id
      AND s.status = 'available'
      AND s.available_date >= CURRENT_DATE()
      AND booked.id IS NULL;

    IF v_new_slot_available = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'New appointment slot is unavailable';
    END IF;

    UPDATE appointments
    SET status = 'cancelled'
    WHERE id = p_appointment_id
      AND patient_id = p_patient_id
      AND status = 'booked';
    SET v_updated = ROW_COUNT();

    IF v_updated = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment not found or cannot be rescheduled';
    END IF;

    UPDATE availability_slots s
    INNER JOIN appointments a ON a.slot_id = s.id
    SET s.status = 'available'
    WHERE a.id = p_appointment_id;

    INSERT INTO appointments (patient_id, doctor_id, slot_id, reason, status)
    SELECT p_patient_id, s.doctor_id, s.id, old_appointment.reason, 'booked'
    FROM availability_slots s
    INNER JOIN appointments old_appointment ON old_appointment.id = p_appointment_id
    WHERE s.id = p_new_slot_id;

    UPDATE availability_slots SET status = 'blocked' WHERE id = p_new_slot_id;
    SELECT LAST_INSERT_ID() AS appointment_id;
END //

DELIMITER ;
