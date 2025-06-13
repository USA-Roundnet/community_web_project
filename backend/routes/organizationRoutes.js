const express = require("express");
const organizationController = require("../controllers/organizationController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", verifyToken, organizationController.createOrganization);
router.get("/", verifyToken, organizationController.getAllOrganizations);
router.get("/:id", verifyToken, organizationController.getOrganizationById);
router.put("/:id", verifyToken, organizationController.updateOrganization);
router.delete("/:id", verifyToken, organizationController.deleteOrganization);

module.exports = router;
