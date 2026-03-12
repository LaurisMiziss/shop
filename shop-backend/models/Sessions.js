const pool = require('../config/db');

const getSessionByHashedToken = async (user_id, token_hash) => {
    const result = await pool.query(
        `SELECT users.id, users.role, sessions.expires_at
        FROM sessions
        JOIN users ON sessions.user_id = users.id
        WHERE users.id = $1
        AND sessions.token_hash = $2;`,
        [user_id, token_hash]
    );

    return result.rows[0];
};

const createSession = async (user_id, token_hash, expires_at) => {
    await pool.query(
        `INSERT INTO sessions (user_id, token_hash, expires_at) 
        VALUES ($1, $2, $3);`,
        [user_id, token_hash, expires_at]
    );
};

const deleteSession = async (user_id, token_hash) => {
    await pool.query(
        `DELETE FROM sessions
        WHERE user_id = $1
        AND token_hash = $2;`,
        [user_id, token_hash]
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
    getSessionByHashedToken,
    createSession,
    deleteSession,
    deleteAllSessionsOfUser,
    cleanupExpiredSessions
};