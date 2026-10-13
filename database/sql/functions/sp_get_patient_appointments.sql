DROP PROCEDURE IF EXISTS sp_get_patient_appointments;
DELIMITER //

CREATE PROCEDURE sp_get_patient_appointments(IN p_patient_id INT)
BEGIN
    SELECT
        a.id,
        d.id,
        d.name,
        d.specialization,
        h.name,
        a.slot_id,
        s.available_date,
        s.start_time,
        s.end_time,
        a.reason,
        a.status
    FROM appointments a
    INNER JOIN doctors d ON d.id = a.doctor_id
    LEFT JOIN hospitals h ON h.id = d.hospital_id
    INNER JOIN availability_slots s ON s.id = a.slot_id
    WHERE a.patient_id = p_patient_id
    ORDER BY s.available_date DESC, s.start_time DESC;
END //

DELIMITER ;
