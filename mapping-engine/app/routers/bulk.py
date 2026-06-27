from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from ..worker import process_bulk_mapping

router = APIRouter(prefix="/v1/map/bulk", tags=["bulk"])

class BulkMapRequest(BaseModel):
    symptoms: List[str] = Field(..., max_items=10000, description="List of symptoms to map")
    sources: Optional[List[str]] = Field(None, description="Preferred sources (e.g. ['who-icd11'])")

class BulkJobResponse(BaseModel):
    job_id: str
    status: str
    message: str

@router.post("", response_model=BulkJobResponse, status_code=202)
def start_bulk_mapping(payload: BulkMapRequest):
    """
    Submit a large list of symptoms for background processing.
    Returns a job_id that can be polled for status.
    """
    # Dispatch the task to Celery/Valkey
    task = process_bulk_mapping.delay(payload.symptoms, payload.sources)
    
    return BulkJobResponse(
        job_id=task.id,
        status="accepted",
        message="Bulk mapping job has been queued successfully."
    )

@router.get("/{job_id}")
def get_bulk_job_status(job_id: str):
    """
    Check the status and retrieve results of a bulk mapping job.
    """
    task = process_bulk_mapping.AsyncResult(job_id)
    
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'status': 'Pending in queue...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0) if task.info else 0,
            'total': task.info.get('total', 1) if task.info else 1,
            'percent': task.info.get('percent', 0) if task.info else 0,
        }
        if 'results' in task.info:
            response['results'] = task.info['results']
    else:
        # Something went wrong in the background job
        response = {
            'state': task.state,
            'status': str(task.info)
        }
    return response
