## Prerequisites

Please make sure that: <br>
[Node.js](https://nodejs.org/en/) <br>
[MongoDB](https://docs.mongodb.com/manual/installation/)<br>
[Nginx](http://nginx.org/en/download.html)<br>
installed on your system. The current Long Term Support **(LTS)** release is an ideal starting point.

## Installation

1. Installing Node

```shell
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

2. Installing Nginx

```shell
sudo apt update
sudo apt install nginx
```

3. Installing MongoDB

```shell
sudo apt update
sudo apt install -y mongodb
sudo systemctl status mongod
```

> You’ll see this output:

    Output
    ● mongod.service - MongoDB Database Server
    Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
    Active: active (running) since Sat 2020-05-23 14:44:01 +08; 1 months 5 days ago
        Docs: https://docs.mongodb.org/manual
    Main PID: 15287 (mongod)
    CGroup: /system.slice/mongod.service
            └─15287 /usr/bin/mongod --config /etc/mongod.conf

4. Download project files & installation

```shell
git clone https://github.com/troth-llc/troth.mn
cd troth.mn
npm install
cd client
npm install
```

5. Configure environment file

```
cp .env.example .env
```

> Environment example

```
JWTSECRET=@
PORT=5000
MONGO=mongodb://{username}:{password}@127.0.0.1:27017/troth?authSource=admin
GMAIL=(mail, gsuite service email)
GCLOUD_ID=(google cloud project id)
MOST_CREATE_TRANSACTION=https://webpos.merchant.mn/ots/api/mapi/TT3051 (most money QR код үүсгэх URL)
PREMIUM_AMOUNT=50000 ( capstone premium гишүүнчлэлийн дүн )
```

> Example nginx configuration (/etc/nginx/sites-enabled/default)

```
server {
        server_name troth.mn;
        location / {
        proxy_pass http://10.140.0.4:8080;
        proxy_set_header Host $host;
        proxy_set_header   X-Forwarded-For $remote_addr;
    }
    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/troth.mn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/troth.mn/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
server {
    if ($host = troth.mn) {
        return 301 https://$host$request_uri;
    }
    listen 80 ;
    listen [::]:80;
    server_name troth.mn;
    return 404;
}
```

## Basic structure

This repository has the following structure:

```text
├───client
│   ├───public
│   └───src
│       ├───assets
│       │   └───image
│       │       ├───project
│       │       └───user
│       ├───components
│       │   ├───bottomNav
│       │   ├───Header
│       │   ├───ProjectItem
│       │   ├───scrollable
│       │   └───SliderItem
│       ├───container
│       │   ├───auth
│       │   ├───calendar
│       │   ├───capstone
│       │   ├───event
│       │   ├───home
│       │   ├───notification
│       │   ├───profile
│       │   ├───project
│       │   │   ├───category
│       │   │   ├───create
│       │   │   ├───edit
│       │   │   └───view
│       │   ├───search
│       │   └───settings
│       └───context
└───src
    ├───controllers
    ├───middleware
    ├───models
    └───routes
```

## Google Services

**Virtual Machine** [https://cloud.google.com/compute/docs/instances](https://cloud.google.com/compute/docs/instances)<br>
**Storage** _google-storage.json_
[Google Bucket](https://cloud.google.com/storage/docs/creating-buckets)<br>
**Email Service Account** _config.json_ [Google Service Accounts](https://cloud.google.com/iam/docs/service-accounts)<br>

_Updated 2020-06-29_
