# Inventory Test

## Description

This project **Inventory Test** demonstrates solutions to three key frontend challenges: eliminating loading interruptions, providing instant user feedback, and handling errors gracefully.

### Task 1: Eliminate the White Screen

To improve the loading experience and prevent blank screens during data fetching:

- Implemented React Router's `Suspense` and `Await`.
- Returned a `Promise` from the route loader to enable deferred data loading.
- Displayed a Polaris spinner as a fallback while data is being loaded.

### Task 2: Achieve Instant Feedback

To provide a responsive user experience:

- Used `fetcher` to submit requests without triggering a full page reload.
- Updated the UI immediately while tracking the request state in the background.
- Disabled the **Claim One** button while a request is being processed to prevent duplicate submissions.

### Task 3: Contain the Blast Radius

To ensure robust error handling:

- Implemented route-level error boundaries for unexpected application errors.
- Handled asynchronous errors from `Await` using the `errorElement` prop.
- Displayed error messages in a Polaris banner.
- Used the revalidator to reload and recover application data when appropriate.

---

## Getting Started

### Project Structure

- `app/routes/dashboard.inventory.tsx` — main dashboard logic (`/dashboard`).
- `app/routes/home.tsx` — home page (`/`).
- `app/models/inventory.server.ts` — simulated backend inventory layer.


### Installation

Install project dependencies:

```bash
npm install
```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```
