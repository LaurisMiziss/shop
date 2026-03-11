const pool = require('../config/db');

const getSessionByToken = async (token) => {
    const result = await pool.query(
        `SELECT users.id, users.username, users.email, users.role, sessions.expires_at
        FROM sessions
        JOIN users ON sessions.user_id = users.id
        WHERE sessions.session_token = $1;`,
        [token]
    );

    return result.rows[0];
};

const createSession = async (user_id, token, expires_at) => {
    await pool.query(
        `INSERT INTO sessions (user_id, session_token, expires_at) 
        VALUES ($1, $2, $3);`,
        [user_id, token, expires_at]
    );
};

const deleteSession = async (token) => {
    await pool.query(
        `DELETE FROM sessions
        WHERE session_token = $1;`,
        [token]
    );
};

const deleteAllSessionsOfUser = async (user_id) => {
    await pool.query(
        `DELETE FROM sessions
        WHERE user_id = $1;`,
        [user_id]
    );
};

const cleanupExpiredSessions = async () => {
    await pool.query(
        'DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;'
    );
};

module.exports = {
    getSessionByToken,
    createSession,
    deleteSession,
    deleteAllSessionsOfUser,
    cleanupExpiredSessions
};