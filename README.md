## インストール
$ npm i bcryptjs cors dotenv jsonwebtoken nodemon pg pg-hstore
$ npm i graphql apollo-server
$ npm install --save sequelize

## グローバル環境にインストール

$ sudo npm install -g sequelize-cli

$ npx sequelize-cli init

## モデルの作成

$ npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string
$ npx sequelize-cli model:generate --name Post --attributes title:string,content:string,user_id:integer

## Docker Command
$ docker-compose up --build
$ docker-compose build --no-cache && docker-compose up

## データベース (PostgreSQL) へのアクセス
$ docker-compose exec db psql -U user -d dev -W

## データベースのマイグレーション
$ docker-compose exec backend node migrate.js

## 32バイトのランダムなデータを生成し、それを16進数の文字列に変換して出力
$ node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"