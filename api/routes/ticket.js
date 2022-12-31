const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket");
const ticket = require("../models/ticket");

router.post("/createTicket", ticketController.CREATE_TICKET);
router.post("/buyTicket", ticketController.BUY_TICKET);
module.exports = router;
