FROM public.ecr.aws/docker/library/python:3.12.4-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENTRYPOINT ["uvicorn","main:app","--reload","--host","0.0.0.0"]
