FROM python:3.10-slim

WORKDIR /app

# Copy requirements from backend folder
COPY backend/requirements.txt ./backend/

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the backend code and dataset into the container
COPY backend/ ./backend/
COPY dataset/ ./dataset/

EXPOSE 5000

# Run the Flask API
CMD ["python", "backend/app.py"]
