# ICD11-NAMASTE-Bridge

Middleware platform enabling interoperability between NAMASTE, ICD-11 TM, and EHR systems.

---

## Problem Statement

SIH25026: API Integration for Traditional Medicine (NAMASTE/ICD-11)

Developing code to integrate the NAMASTE portal and the International Classification of Diseases (Traditional Medicine Module) into existing Electronic Health Record (EHR) systems.

---

## Proposed Solution

This platform enables interoperability between NAMASTE terminology, ICD-11 TM classifications, and modern Electronic Health Record (EHR) systems.

Core objective include:
- terminology mapping,
- standardized healthcare data exchange,
- API interoperability,
- scalable integration architecture.

---

## MVP Goals

- Patient diagnosis input
- NAMASTE ↔ ICD-11 TM terminology mapping
- API-based data exchange
- Structured patient record storage
- Standardized healthcare data responses
- Record visualization dashboard
- EHR-compatible structured output


---

## Proposed Architecture

Frontend  
↓  
Main Backend API  
↓  
Mapping Engine  
↓  
Database / External EHR APIs

---

## Tech Stack

### Frontend
- Next.js

### Backend
- Express.js

### Database
- PostgreSQL

### Mapping Engine
- FastAPI

---

## Repository Structure

```text
/docs
/frontend
/backend
/mapping-engine
```

---

## Team Roles

### Soham Chakraborty - System Design & Mapping Engine
- System design
- Mapping logic
- Service integration

### Adrija Malakar - Backend & Database
- API development
- Database management
- Authentication & backend services

### Malini Singh - Frontend Integration, QA & Documentation
- Frontend development
- API integration
- Testing & validation
- Documentation

---

## References

- NAMASTE Portal
- ICD-11 Traditional Medicine Module
- HL7 FHIR Standards