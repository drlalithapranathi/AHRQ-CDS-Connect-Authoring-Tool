# CDS Connect Authoring Tool

## About

The Clinical Decision Support (CDS) Authoring Tool is a web-based application aimed at simplifying the creation of production-ready CQL code. The project is based on "concept templates" (e.g. gender, HDL Cholesterol, etc.), which allow for additional clinical concepts to be included in the future. Concept modifiers are included to allow for more flexible definitions (e.g. most recent, value comparisons, etc.).

The CDS Authoring Tool is part of the [CDS Connect](https://cds.ahrq.gov/cdsconnect) project, sponsored by the [Agency for Healthcare Research and Quality](https://www.ahrq.gov/) (AHRQ), and initially developed under contract with AHRQ by MITRE's [Health FFRDC](https://www.mitre.org/our-impact/rd-centers/health-ffrdc).

## Contributions

For information about contributing to this project, please see [CONTRIBUTING](CONTRIBUTING.md).

## Development Details

This project uses the MERN stack: Mongo, Express, React, and NodeJS. The project is split into two components:

- [api](api): the backend Express API server
- [frontend](frontend): the frontend React web application

For specific development details of each component, including configuration, see their respective README files.

## Run (Development Quick Start)

### Prerequisites

First, ensure you have [Node.js LTS](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/download-center/community) installed. The CDS Authoring Tool is tested using MongoDB 6.0.x, but later versions are expected to work.

MongoDB can be run using a docker image if desired via

```bash
mkdir -p db
docker run --name=mongodb --volume=$PWD/db:/data/db -p 27017:27017 --restart=unless-stopped --detach=true mongo:6.0
```

This creates a local db directory and then runs a MongoDB docker container that will store files in that directory.

### Install Dependencies

Each of the subprojects (_api_ and _frontend_) must have the dependencies installed via _npm_. This can be done as follows:

```bash
cd api
npm install
```

After the api dependency install successfully runs, install the frontend dependencies:

```bash
cd ../frontend
npm install
```

After the frontend dependency install runs, go back to the root folder:

```bash
cd ..
```

### Configure Authentication

The CDS Authoring Tool requires authentication. Currently LDAP authentication and local file authentication are supported. For local development, the simplest approach is to use local user authentication. To enable it, copy the minimal-example and example-local-users configuration files to `local.json` and `local-users.json`.

_NOTE: The following example uses `cp`. If you are on Windows, use `copy` instead._

```bash
cp api/config/minimal-example.json api/config/local.json
cp api/config/example-local-users.json api/config/local-users.json
```

This will enable the following two users:

- User: `demo`, Password: `password`
- User: `demo2`, Password: `password2`

Of course, these default users and passwords should _never_ be enabled on a public-facing system.

### Run the API and Frontend

In one terminal, run the backend API server:

```bash
cd api
npm start
```

In another terminal, run the frontend server:

```bash
cd frontend
npm start
```

NOTE: Ensure MongoDB is running before starting the CDS Authoring Tool.

When running, the Authoring Tool will be available at [http://localhost:3000/authoring](http://localhost:3000/authoring).

### Testing CQL Execution Results

Testing CQL execution in development requires the API to be configured to use the CQL-to-ELM
Translator and also requires the Translator to be running locally.

To configure the API, edit the configuration settings in `api/config/local.json` to point to a local
instance of the Translator:

```json
"cqlToElm": {
  "url": "http://localhost:8080/cql/translator",
  "active": true
}
```

This should replace any existing cqlToElm configuration block where `active` is set to `false`. See
the Configuration section of the [API README](api/README.md#configuration) for details on configuring the API.

Once the configuration is updated and the API has been restarted the translation service can be run
locally in docker via:

```bash
docker run -p 8080:8080 cqframework/cql-translation-service:v2.3.0
```

### Running tests

The API tests can be run with

```bash
npm --prefix api test
```

The frontend tests can be run with

```bash
npm --prefix frontend test
```

## Docker

This project can be built into a Docker image and deployed as a Docker container. The image runs both the API (port 3001) and frontend (port 9000) using PM2 process manager.

### Pre-built Images

Pre-built images are available from GitHub Container Registry:

```bash
docker pull ghcr.io/iupui-soic/ahrq-cds-connect-authoring-tool:latest
```

### Building the Docker Image Locally

To build the Docker image locally, execute the following command from the project's root directory:

```bash
docker build -t cdsauthoringtool .
```

### Using Docker Compose (Recommended for Development)

The easiest way to run the Authoring Tool locally is with Docker Compose:

```bash
docker compose up
```

This starts:
- **cat**: The Authoring Tool (API + Frontend)
- **cat-mongo**: MongoDB database
- **cat-cql2elm**: CQL-to-ELM translation service

The first time, it will build the image. To force a rebuild, use `--build`:

```bash
docker compose up --build
```

To stop and remove the containers:

```bash
docker compose down
```

When running, access the app at [http://localhost:9000/authoring](http://localhost:9000/authoring).

**NOTE:** For development, mount your local config directory to enable local authentication:

```bash
cp api/config/minimal-example.json api/config/local.json
cp api/config/example-local-users.json api/config/local-users.json
```

### Running Containers Manually

For more control, you can run the containers individually using a Docker network:

```bash
# Create a network
docker network create cds-network

# Start MongoDB
docker run -d --name cat-mongo --network cds-network mongo:6.0

# Start CQL-to-ELM translator
docker run -d --name cat-cql2elm --network cds-network cqframework/cql-translation-service:v2.3.0

# Start the Authoring Tool
docker run -d --name cat \
  --network cds-network \
  -e "MONGO_URL=mongodb://cat-mongo/cds_authoring" \
  -e "CQL_TO_ELM_URL=http://cat-cql2elm:8080/cql/translator" \
  -e "CQL_FORMATTER_URL=http://cat-cql2elm:8080/cql/formatter" \
  -e "AUTH_SESSION_SECRET=$(openssl rand -hex 32)" \
  -e "NODE_ENV=production" \
  -p "9000:9000" \
  -p "3001:3001" \
  ghcr.io/iupui-soic/ahrq-cds-connect-authoring-tool:latest
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost/cds_authoring` |
| `CQL_TO_ELM_URL` | CQL-to-ELM translator URL | `http://localhost:8080/cql/translator` |
| `CQL_FORMATTER_URL` | CQL formatter URL | `http://localhost:8080/cql/formatter` |
| `AUTH_SESSION_SECRET` | Session encryption secret (required) | `secret` (change in production!) |
| `NODE_ENV` | Environment mode | `production` |
| `API_PORT` | API server port | `3001` |
| `PORT` | Frontend server port | `9000` |

#### Branding Configuration

The header can be customized or hidden entirely:

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_BRANDING_ENABLED` | Show/hide header | `false` |
| `REACT_APP_BRANDING_TEXT` | Organization name | (none) |
| `REACT_APP_BRANDING_IMAGE_URL` | Logo image URL | (none) |
| `REACT_APP_BRANDING_LINK_URL` | Header link URL | `#` |
| `REACT_APP_BRANDING_COLOR` | Header text color | `#990000` |

Example with branding enabled:

```bash
docker run -d --name cat \
  --network cds-network \
  -e "MONGO_URL=mongodb://cat-mongo/cds_authoring" \
  -e "CQL_TO_ELM_URL=http://cat-cql2elm:8080/cql/translator" \
  -e "AUTH_SESSION_SECRET=$(openssl rand -hex 32)" \
  -e "REACT_APP_BRANDING_ENABLED=true" \
  -e "REACT_APP_BRANDING_TEXT=My Organization" \
  -e "REACT_APP_BRANDING_LINK_URL=https://example.org" \
  -p "9000:9000" \
  ghcr.io/iupui-soic/ahrq-cds-connect-authoring-tool:latest
```

### Proxying the API

By default, the frontend server on port 9000 proxies requests on `/authoring/api` to the API server on port 3001. In production with an external reverse proxy (like nginx), disable the built-in proxy:

```bash
-e "API_PROXY_ACTIVE=false"
```

### Enabling HTTPS

To enable HTTPS, mount your SSL certificates and set these environment variables:

```bash
docker run -d --name cat \
  -v /path/to/ssl:/data/ssl:ro \
  -e "HTTPS=true" \
  -e "SSL_KEY_FILE=/data/ssl/server.key" \
  -e "SSL_CRT_FILE=/data/ssl/server.cert" \
  # ... other environment variables
  ghcr.io/iupui-soic/ahrq-cds-connect-authoring-tool:latest
```

### Production Deployment

For production deployment with nginx, SSL, and additional services (CQL Services, etc.), see the [cds-connect-deployment](https://github.com/iupui-soic/cds-connect-deployment) repository.

### Container Management

```bash
# Stop containers
docker stop cat cat-mongo cat-cql2elm

# Start containers again
docker start cat-cql2elm cat-mongo cat

# Remove containers
docker rm cat cat-mongo cat-cql2elm

# View logs
docker logs -f cat
```

**NOTE:** The basic setup stores MongoDB data inside the container. For persistence, use a volume:

```bash
docker run -d --name cat-mongo \
  --network cds-network \
  -v mongodb-data:/data/db \
  mongo:6.0
```

## LICENSE

Copyright 2016-2023 Agency for Healthcare Research and Quality

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
