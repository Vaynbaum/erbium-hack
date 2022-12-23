# erbium-hack

В директории backend
1. лежат модули для базы данных `db` 
2. нейронной сети и отправителя сообщений на почту `server`
3. загрузка картинок `upload-image`

## frontend

В директории frontend расположено веб-приложение написанное с помощью фреймворка Angular

Для запуска фронт-части необходимо в директории /frontend прописать команды
> npm i

> npm run start

## backend
### 1 вариант вручную

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
...
12. email_sender = "your_email"
13. password_mail = "your_password_for_external_applications_email"
...
```

Затем запустить командой

> python host.py

### 2 вариант docker

<a  href="https://hub.docker.com/r/serg228/hackf">Docker Hub</a>

Для того чтобы скачать образы, вводим последовательно команды

> docker pull serg228/hackf:ai

> docker pull serg228/hackf:db

> docker pull serg228/hackf:ui

#### 1 вариант docker

Далее вводим команды

Для запуска сервиса нейронной сети
> docker run -p 5200:5200 serg228/hackf:ai

Для запуска сервиса базы данных
> docker run -p 5300:5300 serg228/hackf:db

Для запуска сервиса загрузки фотографий
> docker run -p 5400:5400 serg228/hackf:ui

#### 2 вариант docker-compose

Создай файл docker-compose.yml и в нем пишем

```yml
version: "3.6"

services:

  ai:
    image: serg228/hackf:ai
    restart: always
    ports:
      - 5200:5200

  db:
    image: serg228/hackf:db
    restart: always
    ports:
      - 5300:5300

  ui:
    image: serg228/hackf:ui
    restart: always
    ports:
      - 5400:5400
```

и вводим команду в той же директории что создали файл `docker-compose.yml`

> docker-compose up

После этого в файле `frontend/src/app/shared/urls.ts`
```typescript
export const URL_DB = 'http://localhost:5300';
export const URL_MAILER = 'http://localhost:5200';
export const OWN_URL = 'http://localhost:4200/assets/images';
export const URL_UPLOAD_IMAGE = 'http://localhost:5400';
export const URL_AI = 'http://localhost:5200';
```
