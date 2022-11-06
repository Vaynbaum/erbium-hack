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

email_sender = "your_email"
password = "your_password_for_external_applications_email"


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
        reslist = np.around(reslist, decimals=3)
        tags = []
        for i in range(num_of_tag):
            tags.append(self.clslist[np.argmax(reslist)][:-1])
            reslist = np.delete(reslist, np.argmax(reslist))

        return tags


# JSON package format
class Item(BaseModel):
    text: str


serverSMTP = createServer(email_sender, password)
texttager = model()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "erbium-solution.vercel.app",
        "erbium-solution-5au8cxbu3-vaynbaum.vercel.app",
        "https://erbium-solution-4g1o9kegs-vaynbaum.vercel.app/",
    ],
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
        res = post(serverSMTP, email_sender, email, message, subject, password)
        return res if res else {"mailer_result": "Success"}
    return {"mailer_result": "Failed"}


@app.get("/greeting/")
async def root(email: str, password: str):
    message = f"<h1>Команда Erbium</h1><p>Здравствуйте!</p><p>Мы рады, что вы зарегистрировались на нашем сайте!</p><p>Сохраните ваши данные для входа в систему.</br>Логин: {email}</br>Пароль: {password}</p>"
    subject = "Добро пожаловать!"
    if serverSMTP is not None:
        res = post(serverSMTP, email_sender, email, message, subject, password)
        return res if res else {"mailer_result": "Success"}
    return {"mailer_result": "Failed"}


if __name__ == "__main__":
    uvicorn.run("aihelper:app", host="127.0.0.1", port=5200)
