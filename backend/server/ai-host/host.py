# coding: utf-8

import pickle
from tensorflow.keras.models import load_model
import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sender import createServer, post
import requests
import json
from nltk.tokenize import RegexpTokenizer
from difflib import SequenceMatcher


class model:
    def __init__(self, datapath=""):
        mlsavefile = datapath + "model"
        self.words = pickle.load(open(f"{mlsavefile}_words.pkl", "rb"))
        self.classes = pickle.load(open(f"{mlsavefile}_classes.pkl", "rb"))
        self.model = load_model(f"{mlsavefile}.h5")
        f = open(datapath + "class.txt", "r", encoding="Windows-1251")
        self.clslist = [line for line in f]
        f.close()
        self.lemmatizer = WordNetLemmatizer()

    def __bagwords(self, sentence, words):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [
            self.lemmatizer.lemmatize(word.lower()) for word in sentence_words
        ]
        bag = [0] * len(words)

        for s in sentence_words:
            for i, word in enumerate(words):
                if word == s:
                    bag[i] = 1

        return np.array(bag)

    def predict(self, text, num_of_tag):
        p = self.__bagwords(text, self.words)
        reslist = self.model.predict(np.array([p]))[0]
        tags = []
        for i in range(num_of_tag):
            tags.append(self.clslist[np.argmax(reslist)][:-1])
            reslist = np.delete(reslist, np.argmax(reslist))
        return tags


# JSON package format
class Item(BaseModel):
    text: str


email_sender = "your_email"
password_mail = "your_password_for_external_applications_email"

serverSMTP = createServer(email_sender, password_mail)
texttager = model()
tokenizer = RegexpTokenizer(r"\w+")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "https://erbium-solution.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Work test request
@app.get("/")
def hello_world():
    return "Work sucsf"


# NN response
@app.post("/tagtext")
def post_data(data: Item):
    tags = texttager.predict(data.text, 3)
    return {"tags": tags}


@app.get("/send_code/")
async def root(email: str, code: str):
    message = f"Код: <b>{code}</b>. Никому его не сообщайте!"
    subject = "Восстановление пароля"
    if serverSMTP is not None:
        res = post(serverSMTP, email_sender, email, message, subject, password_mail)
        return res if res else {"mailer_result": "Success"}
    return {"mailer_result": "Failed"}


@app.get("/greeting/")
async def root(email: str, password: str):
    message = f"<h1>Команда Erbium</h1><p>Здравствуйте!</p><p>Мы рады, что вы зарегистрировались на нашем сайте!</p><p>Сохраните ваши данные для входа в систему.</br>Логин: {email}</br>Пароль: {password}</p>"
    subject = "Добро пожаловать!"
    if serverSMTP is not None:
        res = post(serverSMTP, email_sender, email, message, subject, password_mail)
        return res if res else {"mailer_result": "Success"}
    return {"mailer_result": "Failed"}


@app.get("/actual")
async def root(tag: str, description: str):
    r = requests.get(
        "http://178.170.242.204:5300/projectTags?_expand=project&_expand=tag"
    )
    data = json.loads(r.text)
    descriptions = list(
        set([d["project"]["description"] for d in data if d["tag"]["name"] == tag])
    )
    sourcetxt = " ".join(tokenizer.tokenize(description))
    ressim = []
    for i in descriptions:
        matchtxt = " ".join(tokenizer.tokenize(i))
        similrtxt = SequenceMatcher(None, sourcetxt, matchtxt).ratio()
        ressim.append(round(similrtxt, 2))
    finalsim = 0
    for i in ressim:
        finalsim += i
    finalsim = finalsim / len(ressim)

    return {"txtsim": int(10 * (1 - round(finalsim, 1)))}


if __name__ == "__main__":
    uvicorn.run("aihelper:app", host="127.0.0.1", port=5200)
