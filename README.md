# Rechini Village Portal

React + Node.js + PostgreSQL application for Rechini Village, Tandur Mandal, Mancherial District.

## Features

- Village public dashboard
- 14 ward system
- Events
- News: pensions, ration, schemes
- Medical camps
- Private complaints
- Complaints visible only to Sarpanch and Upa-Sarpanch
- JWT login
- PostgreSQL support for AWS RDS

## Default Users

After database setup, run seed command:

```bash
cd backend
npm install
npm run seed
```

Default login:

```text
Sarpanch:
phone: 9000000001
password: sarpanch123

Upa-Sarpanch:
phone: 9000000002
password: upasarpanch123
```

## Local Docker Run

```bash
docker compose up -d --build
```

Open:

```text
http://SERVER_IP:8088
```

## AWS RDS

Use PostgreSQL RDS and update backend `.env`:

```env
DB_HOST=your-rds-endpoint.ap-south-2.rds.amazonaws.com
DB_PORT=5432
DB_NAME=rechini_village
DB_USER=postgres
DB_PASSWORD=your_password
```
