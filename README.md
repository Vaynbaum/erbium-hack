# erbium-hack

<h2><a  href="https://erbium-solution.vercel.app/">Live Demo</a></h2>

В директории backend
1. лежат модули для базы данных `db` 
2. нейронной сети и отправителя сообщений на почту `server`
3. загрузка картинок `upload-image`

В директории frontend расположено веб-приложение написанное с помощью фреймворка Angular

Для запуска фронт-части необходимо в директории /frontend прописать команды
> npm i

> npm run start

Для запуска базы данных в директории /backend/db прописать команды

> npm i

> npm run start

Для запуска модуля загрузка картинок в директории /backend/upload-image прописать команды

> npm i

> npm run start

Для запуска нейронной сети и отправителя сообщений на почту в директории /backend/server 
сначала запустить загрузить необходимые библиотеки для этого прописать команды

> pip install numpy tensorflow fastapi uvicorn pandas openpyxl

> pip install -U nltk

> python -m nltk.downloader -q Russian wordnet omw-1.4 punkt stopwords

Перед запуском необходимо ввести ваш email и пароль (для mail.ru пароль внешних приложений) 
в файле /server/ai-host/host.py 
```python
12. email_sender = "your_email"
13. password = "your_password_for_external_applications_email"
```

Затем запустить командой

> python host.py
