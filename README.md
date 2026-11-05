# Application Platform

A reusable application foundation for building business applications with a consistent backend, frontend, and infrastructure setup.

The goal is to reduce repeated setup work across projects by developing shared foundations for authentication, authorization, user and role management, and common application capabilities.

> **Project status:** The repository is an evolving foundation. The modules listed below describe the intended scope; refer to the source code and commit history for the functionality currently implemented.

## Overview

Application Platform is being developed around three parts:

- **Backend:** Java and Spring Boot services, security, persistence, and application APIs.
- **Frontend:** A React application for interacting with platform capabilities.
- **Infrastructure:** PostgreSQL and Docker-based local development.

## Planned Capabilities

| Module | Purpose |
| --- | --- |
| Authentication | User sign-in and identity verification |
| Authorization | Control access to application resources |
| User Management | Manage user accounts and profiles |
| Role Management | Organize access through roles |
| Permission Management | Define granular application permissions |
| Security | Centralize application security configuration |
| Audit | Establish a foundation for tracking important actions |
| Common Infrastructure | Reusable configuration and shared application components |

These are project goals, not a claim that every module is already complete.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Language | Java |
| Backend framework | Spring Boot |
| Security | Spring Security |
| Persistence | Spring Data JPA |
| Database | PostgreSQL |
| Schema migrations | Flyway |
| Frontend | React, JavaScript / TypeScript |
| Infrastructure | Docker, Docker Compose |

## Architecture Direction

The backend is intended to follow a modular, layered structure so that features can evolve independently while keeping clear responsibilities.

```text
Frontend (React)
       |
       | HTTP / REST
       v
Backend (Spring Boot)
       |
       +-- Authentication
       +-- Authorization
       +-- User Management
       +-- Role & Permission Management
       +-- Shared Infrastructure
       |
       v
Persistence Layer (Spring Data JPA)
       |
       v
PostgreSQL

Local infrastructure: Docker Compose
Database versioning: Flyway
```

This diagram represents the intended architecture. Consult the implementation for the modules and integrations currently available.

## Repository Structure

The repository is organized around a backend, frontend, and supporting infrastructure. The exact directory layout may evolve as the platform develops.

## Getting Started

### Prerequisites

- Java Development Kit (JDK)
- Maven
- Node.js and npm
- Docker Desktop with Docker Compose
- PostgreSQL (or the configured PostgreSQL Docker service)

### Clone the repository

```bash
git clone https://github.com/vijay71437/application-platform.git
cd application-platform
```

### Run the application

The exact startup commands depend on the current backend, frontend, and Docker Compose configuration. Check the project directories and their configuration files for the active commands and required environment variables.

Do not commit local `.env` files, database passwords, signing keys, or other secrets.

## Engineering Goals

The project is intended to explore and establish:

- Reusable authentication and authorization foundations.
- Clear separation of concerns and modular backend design.
- Role-based and permission-based access control.
- Version-controlled database schema changes.
- Consistent frontend/backend integration.
- Repeatable local development using containers.

## Related Projects

- [Finance Tracker Backend](https://github.com/vijay71437/finance-tracker-backend)
- [Finance Tracker Frontend](https://github.com/vijay71437/finance-tracker-frontend)
- [GitHub Profile](https://github.com/vijay71437)

---

**Maintainer:** [vijay71437](https://github.com/vijay71437)
