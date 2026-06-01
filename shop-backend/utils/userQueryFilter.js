const userQueryFilter = (is_admin, limit, offset, user_id = undefined) => {

    if (!is_admin) return "Error";

    let query = 
        `SELECT
            u.id,
            u.username,
            u.email,
            u.role,
            u.full_name,
            u.phone,
            u.country,
            u.last_login,
            COUNT(*) OVER() AS total
        FROM users u`;

    if (user_id) {
        query += ` WHERE u.id = ${user_id}`
    }

    query +=
        ` GROUP BY u.id
        ORDER BY u.id DESC
        LIMIT $1 OFFSET $2;`;

    return query;

};

module.exports = userQueryFilter;