<div align="center">

# <img src="https://api.iconify.design/tabler:git-branch.svg?color=%232d4a9e&width=40" width="34" style="vertical-align:middle" /> Barangay San Roque System - Code Excerpts

**Selected source code from a BSIT capstone project's Family Tree and Data Analytics modules**

<img src="https://img.shields.io/badge/status-code%20excerpts-2d4a9e?style=for-the-badge" />
<img src="https://img.shields.io/badge/source-not%20the%20full%20system-c0392b?style=for-the-badge" />
<img src="https://img.shields.io/badge/team-ERROR%20404-1a2440?style=for-the-badge" />

<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />

[What's Here](#-whats-here) &middot; [Why These Two](#-why-these-two) &middot; [About the Full System](#-about-the-full-system)

</div>

<br />

> <img src="https://api.iconify.design/tabler:alert-triangle.svg?color=%23d29922&width=18" width="16" style="vertical-align:text-bottom" /> **This is an excerpt, not a showcase.** It holds exactly two functions pulled from a much larger private codebase, shared for academic reference (a Chapter 3 source code appendix). It is not runnable on its own and does not represent the complete system.

## <img src="https://api.iconify.design/tabler:file-code.svg?color=%232d4a9e&width=24" width="20" style="vertical-align:middle" /> What's Here

| File | What it does |
|---|---|
| [`familyTreeService.js`](./familyTreeService.js) | Recursive algorithm that builds a resident's full family tree from stored relationship records - handles cycle detection, generation tracking, and every relationship type (parent, spouse, sibling, cousin). |
| [`analyticsService.js`](./analyticsService.js) | Demographic aggregation logic behind the system's Data Analytics module - runs twenty population queries in parallel and applies the business rule that excludes rejected records from headline counts. |

## <img src="https://api.iconify.design/tabler:target-arrow.svg?color=%232d4a9e&width=24" width="20" style="vertical-align:middle" /> Why These Two

Out of a backend spanning 12 database models and thousands of lines across services and controllers, these two functions were chosen because they carry the most interesting algorithmic weight in the whole system: one turns flat relationship rows into a navigable family tree, the other turns raw resident records into decision-ready statistics for barangay staff.

## <img src="https://api.iconify.design/tabler:building-community.svg?color=%232d4a9e&width=24" width="20" style="vertical-align:middle" /> About the Full System

**Web-Based Family Tree System for Household Profiling, Resident Verification with Data Analytics for Barangay San Roque** replaces manual, paper-based barangay record-keeping with a centralized web platform. The complete system additionally includes:

- Resident verification workflow (verify, reject, duplicate detection)
- Certificate request, approval, and issuance
- Household management and family relationship editing
- Public self-registration with ID verification, usable on mobile
- Staff authentication and role-based access
- A full React/MUI frontend

None of the above is included in this repository. The complete source lives in a private repository, since this is an active capstone system built around real barangay resident data.

---

<div align="center"><sub>BSIT Capstone Project &middot; Team ERROR 404</sub></div>
