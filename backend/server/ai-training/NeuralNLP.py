
from Model import get_medel
import random
import pickle
import numpy as np
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

import nltk

from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
russian_stopwords = stopwords.words("russian")

from tensorflow.keras.optimizers import SGD
from tensorflow.keras.models import load_model
import pandas as pd

class ncm():
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()


    def numclass(self, classes, lendata):
        numclass = []
        ind = 0
        num = []

        for i in range(lendata - 1):
            if classes[i] not in numclass:
                numclass.append(classes[i])
                num.append(ind)
                ind += 1

        return dict(zip(numclass, num))

    # Обучение модели
    def train_model(self, epoh = 250, batchSZ = 5, log = True, data_path='', lendata=72):
        self.words = []
        self.classes = []
        documents = []
        ignore_letters = ['!', '?', ',', '.']

        # read xls file
        xdata = pd.ExcelFile(data_path)
        sheetX = xdata.parse(0)
        tags = sheetX['class']
        text = sheetX['text']

        # take data from xls file
        for i in range(lendata - 1):
            word = nltk.word_tokenize(text[i])
            self.words.extend(word)
            documents.append((word, tags[i]))

        if (log): print(documents)

        self.words = [self.lemmatizer.lemmatize(w.lower()) for w in self.words if w not in ignore_letters]
        self.words = sorted(list(set(self.words)))
        self.classes = self.numclass(tags , lendata)

        training = []
        output_empty = [0] * len(self.classes)

        # simplify data
        for doc in documents:
            bag = []
            word_patterns = doc[0]
            word_patterns = [self.lemmatizer.lemmatize(word.lower()) for word in word_patterns]
            for word in self.words:
                bag.append(1) if word in word_patterns else bag.append(0)

            output_row = list(output_empty)
            output_row[self.classes[doc[1]]] = 1
            training.append([bag, output_row])

        random.shuffle(training)
        training = np.array(training)
        train_data = list(training[:, 0])
        train_lables = list(training[:, 1])

        # data for testing
        _, test_data, __, test_lables = train_test_split(train_data, train_lables, test_size=0.05, random_state=415)

        # train
        self.model = get_medel(len(train_data[0]), len(train_lables[0]))
        sgd = SGD(lr=0.01, decay=1e-6, momentum=0.9, nesterov=True)
        self.model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['categorical_accuracy'])

        self.hist = self.model.fit(np.array(train_data), np.array(train_lables),
                                   validation_data=(test_data, test_lables),
                                   epochs=epoh, batch_size=batchSZ, verbose=1)
        if(log):

            # Network evaluation
            print('\n# Оцениваем на тестовых данных')
            results = self.model.evaluate(test_data, test_lables)
            print('\ntest loss:', (round(results[0] * 100, 1)))
            print('test acc:', round(results[1] * 100, 1))

            # output of training schedules
            N = np.arange(0, epoh)
            plt.style.use("ggplot")
            plt.figure()
            plt.plot(N, self.hist.history["loss"], label="train_loss")
            plt.plot(N, self.hist.history["categorical_accuracy"], label="train_acc")
            plt.plot(N, self.hist.history["val_loss"], label="val_loss")
            plt.plot(N, self.hist.history["val_categorical_accuracy"], label="val_acc")
            plt.title("Training Loss and Accuracy")
            plt.xlabel("Epoch #")
            plt.ylabel("Loss/Accuracy")
            plt.legend()
            plt.show()

    def save_model(self, savepath):
            self.model.save(f"{savepath}.h5", self.hist)
            pickle.dump(self.words, open(f'{savepath}_words.pkl', 'wb'))
            pickle.dump(self.classes, open(f'{savepath}_classes.pkl', 'wb'))

    def load_model(self, loadpath):
            self.words = pickle.load(open(f'{loadpath}_words.pkl', 'rb'))
            self.classes = pickle.load(open(f'{loadpath}_classes.pkl', 'rb'))
            self.model = load_model(f'{loadpath}.h5')


    def bag_of_words(self, sentence, words):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [self.lemmatizer.lemmatize(word.lower()) for word in sentence_words]
        bag = [0] * len(words)

        for s in sentence_words:
            for i, word in enumerate(words):
                if word == s:
                    bag[i] = 1

        return np.array(bag)

    def predict_class(self, sentence):
        p = self.bag_of_words(sentence, self.words)
        res = self.model.predict(np.array([p]))[0]
        return np.around(res, decimals=3)



x = ncm()
x.train_model(epoh=50, data_path='ds.xlsx', log=False)
x.save_model('save\\model')
