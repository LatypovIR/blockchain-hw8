## Frontend

В проекте испозуется frontend:

1. Для выбора изображения используйте "drop or select PNG" 
2. Для отправки изображения на хранение нажмите "Upload"
3. Для загрузки "Download"

## Start

В корне проекта выполните следующее:

```
~> npm install
~> npx hardhat node
~> npx hardhat run scripts/deploy.js --network localhost
Deploy using account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Store deployed success!
Store's address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Для запуска фронтенда:

```
~> cd frontend && npm install
~> npm start
```

## Tests

Также присутствуют базовые тесты контракта:

```
$ npx hardhat test

Store contract
    ✔ Deployment (1311ms)
    ✔ Success save and get file hash (72ms)
    ✔ Produce event on hash saving (43ms)
    ✔ No files for new users
    ✔ Success save and get on hash re-saving (86ms)


  5 passing (2s)

```
