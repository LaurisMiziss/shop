const requireAdmin = async (req, res, next) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        info: "Forbidden"
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

module.exports = requireAdmin;