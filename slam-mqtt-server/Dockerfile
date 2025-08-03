FROM python:3.7-slim

RUN apt-get update && \
    apt-get install -y gcc libgl1 libglib2.0-0 && \
    pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]