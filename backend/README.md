- to run Docker
  - in docker folder
    - docker compose -f .\docker\docker-compose.yml --env-file .env up
- to run server
  - run ngrok first
    - `ngrok http 8000`
  - then run server
    - `fastapi dev`

- to autogenerate migration file 
`alembic revision --autogenerate -m <message>`

- to upgrade database schema
`alembic upgrade head`
