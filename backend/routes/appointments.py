import logging

from fastapi import APIRouter, HTTPException, status

from backend.models import (
    AppointmentListResponse,
    AppointmentRecord,
    AppointmentRequest,
    AppointmentRescheduleRequest,
    AppointmentResponse,
)
from backend.services.database import DatabaseError, call_stored_procedure, db_session


logger = logging.getLogger(__name__)
router = APIRouter(tags=["appointments"])


def _appointment_records(rows: list[tuple]) -> AppointmentListResponse:
    return AppointmentListResponse(
        appointments=[
            AppointmentRecord(
                appointment_id=int(row[0]),
                doctor_id=int(row[1]),
                doctor_name=str(row[2]),
                specialization=str(row[3]),
                hospital=str(row[4]) if row[4] is not None else None,
                slot_id=int(row[5]),
                appointment_date=str(row[6]),
                start_time=str(row[7]),
                end_time=str(row[8]),
                reason=str(row[9]),
                status=str(row[10]),
            )
            for row in rows
        ]
    )


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


@router.get("/appointments/{patient_id}", response_model=AppointmentListResponse)
def list_appointments(patient_id: int) -> AppointmentListResponse:
    try:
        with db_session() as conn:
            rows = call_stored_procedure(conn, "sp_get_patient_appointments", [patient_id])
    except DatabaseError as exc:
        logger.exception("Appointment history lookup failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to load appointments") from exc
    return _appointment_records(rows)


@router.post("/appointments/cancel", response_model=AppointmentResponse)
def cancel_appointment(patient_id: int, appointment_id: int) -> AppointmentResponse:
    try:
        with db_session() as conn:
            rows = call_stored_procedure(conn, "sp_cancel_appointment", [patient_id, appointment_id])
            conn.commit()
    except DatabaseError as exc:
        logger.exception("Appointment cancellation failed")
        detail = str(exc)
        code = status.HTTP_409_CONFLICT if "cannot be cancelled" in detail.lower() else status.HTTP_500_INTERNAL_SERVER_ERROR
        raise HTTPException(status_code=code, detail=detail) from exc
    if not rows:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Cancellation was not confirmed")
    return AppointmentResponse(message="Appointment cancelled", appointment_id=appointment_id)


@router.post("/appointments/reschedule", response_model=AppointmentResponse)
def reschedule_appointment(request: AppointmentRescheduleRequest) -> AppointmentResponse:
    try:
        with db_session() as conn:
            rows = call_stored_procedure(
                conn,
                "sp_reschedule_appointment",
                [request.patient_id, request.appointment_id, request.new_slot_id],
            )
            conn.commit()
    except DatabaseError as exc:
        logger.exception("Appointment rescheduling failed")
        detail = str(exc)
        code = status.HTTP_409_CONFLICT if "unavailable" in detail.lower() or "cannot be rescheduled" in detail.lower() else status.HTTP_500_INTERNAL_SERVER_ERROR
        raise HTTPException(status_code=code, detail=detail) from exc
    if not rows:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Rescheduling was not confirmed")
    return AppointmentResponse(message="Appointment rescheduled", appointment_id=int(rows[0][0]))
