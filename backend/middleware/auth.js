const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
      req.isAuthenticated = false;
    } else {
      req.isAuthenticated = true;
    }
    next();
  };
  
  module.exports = { checkAuth };