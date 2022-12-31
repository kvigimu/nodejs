const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema({
  title: { type: String, required: true, min: 3 },
  ticket_price: { type: Number, required: true },
  from_location: { type: String, required: true, min: 3 },
  to_location: { type: String, required: true, min: 3 },
  to_location_photo_url: { type: String },
});

module.exports = mongoose.model("ticket", TicketSchema);
