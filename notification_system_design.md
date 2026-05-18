# Notification System Design

## Overview

This project is a frontend-first notification dashboard with a minimal backend API and a separate logging middleware.
The frontend is built with React and Vite, and the backend uses Node.js and Express for secure API access.

## Frontend Architecture

The frontend uses:
- React components for UI structure.
- Axios for HTTP communication with the backend.
- A simple service layer under `src/services` for API and log requests.
- Clean component separation between the form and notification list.

## Backend Architecture

The backend provides:
- A `notifications` API for create/read/delete operations.
- A `/log` endpoint to receive frontend log events.
- In-memory storage for notifications for simplicity.
- A shared logging module that forwards events to the evaluation service.

## Logging Middleware

The logging middleware is hosted under `logging-middleware/index.js`.
It uses Axios to send structured logs to the evaluation service and reads a token from `process.env.ACCESS_TOKEN`.
The backend forwards frontend log events to the middleware, keeping secrets out of client code.

## API Communication

Frontend -> Backend
- `GET /notifications` to load existing notifications.
- `POST /notifications` to add new notifications.
- `DELETE /notifications/:id` to remove notifications.
- `POST /log` to record frontend events.

Backend -> Evaluation Service
- The backend uses `logging-middleware` to publish logs with authorization.

## Folder Structure

```
notification_app_fe/
  src/
    components/
    pages/
    services/
    App.jsx
    main.jsx
    index.css
notification_app_be/
  routes/
  app.js
  .env
logging-middleware/
  index.js
notification_system_design.md
.gitignore
```

## Error Handling

The frontend shows basic error messages when requests fail.
The backend validates incoming notification payloads and logs warnings for malformed requests.

## Future Improvements

- Persist notifications in a database.
- Add authentication for admin access.
- Add search and filter support.
- Add user feedback for successful operations.
