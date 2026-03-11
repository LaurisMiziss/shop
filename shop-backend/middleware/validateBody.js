const validateBody = (body_name) => {
    return (req, res, next) => {
        try {
            if (req.body[body_name] !== undefined) {
                
                const value = +req.body[body_name];

                if (!Number.isInteger(value) || value <= 0) {
                    return res.status(400).json({
                        success: false,
                        info: `Invalid ${body_name}`
                    });
                }

                req.body[body_name] = value;
                
            } else {
                res.status(400).json({
                    success: false,
                    info: "Missing required field(s)"
                });
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

module.exports = validateBody;