FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if any are needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Pre-install the lightweight CPU version of PyTorch to avoid massive GPU downloads
RUN pip install --default-timeout=1000 --retries 10 torch --index-url https://download.pytorch.org/whl/cpu

# Install standard Python dependencies from fast PyPI
RUN sed -i 's/\r$//' requirements.txt && pip install --upgrade pip && pip install --default-timeout=1000 --retries 10 --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the API port
EXPOSE 8000

# Set default environment variables
ENV ME_LOCAL_ENABLED=true
ENV ME_WHO_ENABLED=true

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
