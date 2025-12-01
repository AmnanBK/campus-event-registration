-- Mengaktifkan ekstensi untuk UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL USERS
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nim VARCHAR(9) UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'organizer', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABEL EVENTS
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(200) NOT NULL,
    quota INTEGER NOT NULL CHECK (quota > 0),
    poster_url VARCHAR(255),
    status VARCHAR(150) NOT NULL CHECK (status IN ('open', 'closed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABEL REGISTRATIONS
CREATE TABLE registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);
