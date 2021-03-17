# informationService
お知らせの情報を管理します。  
typescript & grpc

# 利用方法
| 環境変数名  | 説明                             | default               |
|------------|----------------------------------|-----------------------|
| ADMIN_USER | 権限を持たせるユーザーID           | なし                   |
| PG_HOST     | Postgres接続先のホスト名         | postgres              |
| PG_PORT     | Postgres接続先のポート番号       | 5432                  |
| PG_DATABASE | Postgres接続先のデータベース名   | twinte_course_service |
| PG_USER     | Postgres接続に使用するユーザー名 | postgres              |
| PG_PASSWORD | Postgres接続に使用するパスワード | postgres              |
| LOG_LEVEL   | ログレベル fatal / error / warn / info / debug / trace / off | info      

# 推奨開発環境
docker + vscode を使うことで簡単に開発可能。

1. [RemoteDevelopment](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)拡張機能をインストール
2. このプロジェクトのフォルダを開く
3. 右下に `Folder contains a Dev Container configuration file. Reopen folder to develop in a container` と案内が表示されるので`Reopen in Container`を選択する。（表示されない場合はコマンドパレットを開き`open folder in container`と入力する）
4. node14の開発用コンテナが立ち上がりVSCodeで開かれる。また、`.devcontainer/docker-compose.yml` に任意のサービスを追加するとvscode起動時に一緒に起動できる（データベース等）。

# v3バックエンドサービス一覧
 - API Gateway
 - Auth Callback
 - User Service
 - Session Service
 - Timetable Service
 - Course Service
 - Search Service
 - Donation Service
 - School Calendar Service
 - Information Service (here)
 - Task Service