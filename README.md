# delirium-scorecard

An application to predict delirium prevalence rates at hospitals.

This is a Next.js application that displays delirium prevalence rates at hospitals. It uses a React frontend with a clean, clinical dashboard interface.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 14 or later)
- npm (usually comes with Node.js)

## Getting Started

To get the application running on your local machine, follow these steps:

1. Clone the repository:

```bash
git clone git@github.com:VectorInstitute/delirium-scorecard.git
```

2. Navigate to the project frontend directory:

```bash
cd delirium-scorecard/frontend
```

3. Install the dependencies:

```bash
npm install
```

4. Run the frontend server in development mode:

```bash
npm run dev -- -p <port>
```

5. Navigate to the repository root and install backend dependencies:

```bash
cd delirium-scorecard
poetry install
```

6. Run the backend server:

```bash
uvicorn backend.api.main:app --reload --host 0.0.0.0 --port <port>
```

6. Open your browser and visit `http://localhost:<port>` to see the application.

## Project Structure

This project is divided into two main directories: `frontend` for the Next.js application and `backend` for the FastAPI server.

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── components/
│   │   ├── DeliriumRates.tsx
│   │   ├── TimeTrends.tsx
│   │   ├── PatientDemographics.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── ThemeRegistry.tsx
│   │   ├── globals.css
│   │   └── faq/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── error.tsx
│   │       └── loading.tsx
├── theme.ts
├── public/
│   └── images/
├── package.json
└── next.config.mjs
```

- `components/`: Reusable React components
- `app/`: Next.js pages and routing
- `public/`: Static assets like images

### Backend (FastAPI)

```
backend/
├── api/
│   ├── main.py
│   ├── routes.py
│   └── delirium.py
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache 2.0 license.

## Acknowledgements

- [Vector Institute](https://vectorinstitute.ai/)
- [GEMINI](https://geminimedicine.ca/)
