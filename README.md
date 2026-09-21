# Barangay San Roque System — Code Excerpts

Selected source code excerpts from the **Web-Based Family Tree System for Household
Profiling, Resident Verification with Data Analytics for Barangay San Roque**, a
BSIT capstone project by Team ERROR 404.

This repository contains **two representative functions**, not the complete system:

- **`familyTreeService.js`** — the recursive algorithm that builds a resident's
  family tree from stored relationship records, including cycle detection and
  generation tracking.
- **`analyticsService.js`** — the demographic aggregation logic behind the
  system's Data Analytics module, including its population-count business
  rules and parallelized queries.

The full system also includes resident verification, certificate issuance,
household management, public self-registration, authentication, and a
complete web frontend — none of which is included here. These two files were
extracted specifically to illustrate the system's core algorithmic logic for
academic reference.
