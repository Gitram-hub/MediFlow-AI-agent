DROP PROCEDURE IF EXISTS sp_cancel_appointment;
DELIMITER //

CREATE PROCEDURE sp_cancel_appointment(
    IN p_patient_id INT,
    IN p_appointment_id INT
)
BEGIN
    DECLARE v_updated INT DEFAULT 0;

    UPDATE appointments
    SET status = 'cancelled'
    WHERE id = p_appointment_id
      AND patient_id = p_patient_id
      AND status = 'booked';

    SET v_updated = ROW_COUNT();

    IF v_updated = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment not found or cannot be cancelled';
    END IF;

    UPDATE availability_slots s
    INNER JOIN appointments a ON a.slot_id = s.id
    SET s.status = 'available'
    WHERE a.id = p_appointment_id;

    SELECT p_appointment_id AS appointment_id;
END //

DELIMITER ;
