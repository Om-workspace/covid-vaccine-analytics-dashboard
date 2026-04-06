# 🦠 COVID-19 Vaccination Analytics Dashboard

A full-stack interactive dashboard that visualizes India's COVID-19 vaccination data across states, vaccines, and demographics.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![Python](https://img.shields.io/badge/Python-3.10+-blue) ![React](https://img.shields.io/badge/React-19-61DAFB) ![Flask](https://img.shields.io/badge/Flask-3.1-000000) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

---

## ✨ Features

- **📊 Interactive Charts** — Bar charts, donut charts, and area charts powered by Recharts
- **🔢 Animated Counters** — Stat cards with smooth count-up animations on page load
- **🗺️ State-wise Analysis** — Top 10 states by total doses, first vs second dose comparison
- **👥 Gender Distribution** — Visual breakdown of male vs female vaccination numbers
- **💉 Vaccine Breakdown** — Covishield, Covaxin, and Sputnik V distribution data
- **🎨 Modern Dark UI** — Glassmorphism, gradient accents, and responsive design
- **🐳 Docker Ready** — One-command deployment with Docker Compose

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| **Frontend** | React 19 + Vite 8, Recharts, Axios, Lucide Icons |
| **Backend**  | Python 3.10+, Flask 3.1, Pandas, Flask-CORS       |
| **Dataset**  | CSV (India statewise vaccination data)             |
| **DevOps**   | Docker, Docker Compose, Nginx                      |

---

## 📁 Project Structure

```
covid-dashboard/
├── backend/
│   ├── app.py                # Flask API server
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend Docker image
├── dataset/
│   └── covid_vaccine_hybrid_statewise.csv  # Vaccination dataset
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main dashboard component
│   │   ├── index.css         # Global styles & design system
│   │   └── main.jsx          # React entry point
│   ├── package.json
│   └── Dockerfile            # Frontend Docker image (multi-stage)
├── docker-compose.yml        # Orchestrates frontend + backend
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+
- **Docker** (optional, for containerized deployment)

---

### Option 1: Run Locally

#### 1. Backend (Flask API)

```bash
# From the project root
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

> Backend runs at **http://localhost:5000**

#### 2. Frontend (Vite + React)

```bash
# From the project root
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> Frontend runs at **http://localhost:5173**

---

### Option 2: Run with Docker

```bash
# From the project root
docker compose up --build
```

| Service    | URL                      |
|------------|--------------------------|
| Frontend   | http://localhost:5173     |
| Backend    | http://localhost:5000     |

---

## 📡 API Endpoints

| Method | Endpoint              | Description                            |
|--------|-----------------------|----------------------------------------|
| GET    | `/first-dose`         | First dose totals by state             |
| GET    | `/second-dose`        | Second dose totals by state            |
| GET    | `/total-dose`         | Total doses by state                   |
| GET    | `/latest`             | Summary of all states with dose data   |
| GET    | `/vaccines`           | Vaccine-wise distribution per state    |
| GET    | `/by-vaccine/<name>`  | Doses by state for a specific vaccine  |
| GET    | `/gender`             | Male vs female vaccination totals      |
| GET    | `/state/<name>`       | Detailed data for a specific state     |
| GET    | `/states`             | List of all states                     |

---

## 📊 Dataset

The dashboard uses `covid_vaccine_hybrid_statewise.csv` with the following columns:

| Column              | Description                        |
|---------------------|------------------------------------|
| `State`             | Indian state name                  |
| `Vaccine`           | Vaccine type (Covishield/Covaxin/Sputnik V) |
| `First Dose`        | Number of first doses administered |
| `Second Dose`       | Number of second doses administered|
| `Total Doses`       | Total doses administered           |
| `Female Vaccinated` | Number of females vaccinated       |
| `Male Vaccinated`   | Number of males vaccinated         |

**Coverage:** 16 states/UTs × 3 vaccines = 48 data rows

---

## 🖼️ Dashboard Sections

1. **Summary Cards** — Total Doses, First Dose, Second Dose, Total Vaccinated (with animated counters)
2. **Top 10 States** — Horizontal bar chart with gradient bars
3. **Gender Distribution** — Donut chart (Male vs Female)
4. **Dose Comparison** — Area chart showing First vs Second dose across top 15 states

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
