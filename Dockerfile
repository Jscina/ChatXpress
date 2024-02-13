# Stage 1: Python dependencies
FROM python:3.11-slim-buster as python-deps

WORKDIR /app/src-tauri/src/plugins/

COPY . /app

RUN pip install poetry \
  && poetry config virtualenvs.create false \
  && poetry install --no-dev

# Stage 2: Node.js dependencies
FROM node:21-bookworm-slim as node-build

WORKDIR /app

COPY --from=python-deps /app .

RUN npm install

# Stage 3: Rust build
FROM rust:1.76.0-slim as rust-build

WORKDIR /app

COPY --from=node-build /app .

RUN cargo install tauri-cli \
  && cargo build --release

# Stage 4: Final image
FROM debian:latest

WORKDIR /app

COPY --from=rust-build /app/target/release/chatxpress /app

CMD ["./chatxpress"]

