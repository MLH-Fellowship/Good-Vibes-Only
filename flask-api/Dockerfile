
FROM python:3.8.6
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD gunicorn -b 0.0.0.0:$PORT app:app