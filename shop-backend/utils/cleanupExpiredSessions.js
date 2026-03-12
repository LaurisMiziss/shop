const Session = require('../models/Sessions');

const cleanupExpiredSessions = async () => {
    await Session.cleanupExpiredSessions();
};

module.exports = cleanupExpiredSessions;