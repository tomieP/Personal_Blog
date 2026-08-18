/**
 * @param  {...string} allowedRoles - Danh sách các role được phép truy cập
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Kiểm tra xem thông tin user đã được gắn vào req chưa (từ Auth Middleware trước đó)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Chưa xác thực người dùng",
      });
    }

    // 2. Kiểm tra xem role của user có nằm trong danh sách được phép hay không
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện hành động này",
      });
    }

    // 3. Nếu đúng quyền, cho phép đi tiếp sang Controller
    next();
  };
};

module.exports = authorize;