# Database Documentation

## Overview
The application uses MongoDB as its primary database.
- **Connection URI**: Loaded from `.env` (`MONGODB_URI`).
- **Database Name**: Extracted from URI or defaults to the specified database in the connection string (e.g., `STONA`).
- **Driver**: MongoDB PHP Driver (via `mongodb/mongodb` composer package in the new backend).

## Principles
- **No SQL Injection**: Handled safely by the MongoDB driver using BSON formatting.
- **Data Integrity**: Enforced manually in PHP, as MongoDB is schema-less.
- **Timestamps**: `createdAt` and `updatedAt` are standard on all major collections.
