- to run server
  - run ngrok first
    - `ngrok http 3000`
  - then run server
    - `fastapi dev`

- to autogenerate migration file 
`alembic revision --autogenerate -m <message>`

- to upgrade database schema
`alembic upgrade head`