FROM python:3.8

WORKDIR /hackshit

RUN pip install numpy tensorflow fastapi uvicorn pandas openpyxl
RUN pip install -U nltk
RUN python -m nltk.downloader -q Russian wordnet omw-1.4 punkt stopwords
                                                                                                                                                                                                     
COPY . /hackshit

EXPOSE 5200
CMD ["uvicorn", "host:app", "--host", "0.0.0.0", "--port", "5200"]