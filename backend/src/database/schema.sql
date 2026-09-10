CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discord_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    avatar TEXT NOT NULL,
    token TEXT NOT NULL
);

CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id TEXT NOT NULL REFERENCES users(discord_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    anonymous BOOLEAN NOT NULL,
    allow_multiple BOOLEAN NOT NULL,
    theme TEXT NOT NULL,
    background TEXT NOT NULL
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    user_id TEXT,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    image TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);