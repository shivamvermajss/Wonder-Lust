const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

/* =====================
   INDEX + CREATE
===================== */
router.route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"), // ✅ FIRST multer
    validateListing,                 // ✅ THEN Joi
    wrapAsync(listingsController.createListing)
  );

/* =====================
   NEW
===================== */
router.get("/new", isLoggedIn, listingsController.renderNewForm);

/* =====================
   SHOW / UPDATE / DELETE
===================== */
router.route("/:id")
  .get(wrapAsync(listingsController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"), // ✅ FIRST multer
    validateListing,                 // ✅ THEN Joi
    wrapAsync(listingsController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.destroyListing)
  );

/* =====================
   EDIT
===================== */
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm)
);

module.exports = router;
