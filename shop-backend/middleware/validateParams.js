const validateParams = (paramName) => {
    return (req, res, next) => {
        try {
            if (req.params[paramName] !== undefined) {

                const value = Number(req.params[paramName]);
                
                if (!Number.isInteger(value) || value <= 0) {
                    return res.status(400).json({
                        success: false,
                        info: `Invalid ${paramName}`
                    });
                }

                req.params[paramName] = value;
                
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

module.exports = validateParams;