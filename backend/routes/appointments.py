import logging

from fastapi import APIRouter, HTTPException, status

from backend.models import AppointmentRequest, AppointmentResponse
from backend.services.database import DatabaseError, call_stored_procedure, db_session


logger = logging.getLogger(__name__)
router = APIRouter(tags=["appointments"])


@router.post("/appointments", response_model=AppointmentResponse)
def create_appointment(request: AppointmentRequest) -> AppointmentResponse:
    try:
        logger.info(f"Creating appointment with patient_id={request.patient_id}, doctor_id={request.doctor_id}, slot_id={request.slot_id}")
        with db_session() as conn:
            rows = call_stored_procedure(
                conn,
                "sp_create_appointment",
                [request.patient_id, request.doctor_id, request.slot_id, request.reason],
            )
            appointment_id = rows[0][0] if rows else None
            if appointment_id is None:
                conn.rollback()
                logger.error("Appointment creation returned None")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create appointment",
                )
            conn.commit()
            logger.info(f"Appointment created successfully with ID: {appointment_id}")
    except HTTPException:
        raise
    except DatabaseError as exc:
        logger.exception("Appointment creation failed")
        detail = str(exc)
        if "already booked" in detail.lower():
            response_status = status.HTTP_409_CONFLICT
        elif "unavailable" in detail.lower():
            response_status = status.HTTP_409_CONFLICT
        elif "patient does not exist" in detail.lower():
            response_status = status.HTTP_404_NOT_FOUND
        else:
            response_status = status.HTTP_500_INTERNAL_SERVER_ERROR
        raise HTTPException(status_code=response_status, detail=detail) from exc

    return AppointmentResponse(message="Appointment created", appointment_id=int(appointment_id))
