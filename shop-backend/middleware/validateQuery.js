const validateQuery = (query_name) => {
    return (req, res, next) => {
        try {
            if (req.query[query_name] !== undefined) {
                
                const value = +req.query[query_name];

                if (!Number.isInteger(value) || value <= 0) {
                    return res.status(400).json({
                        success: false,
                        info: `Invalid ${query_name}`
                    });
                }

                req.query[query_name] = value;
            }

            next();
            
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                info: "Database error"
            });
        };
    };
};

module.exports = validateQuery;