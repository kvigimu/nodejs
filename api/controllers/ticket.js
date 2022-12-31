const TicketSchema = require("../models/ticket");
const UserSchema = require("../models/user");
module.exports.CREATE_TICKET = function (req, res) {
  const ticket = new TicketSchema({
    title: req.body.title,
    ticket_price: req.body.ticket_price,
    from_location: req.body.from_location,
    to_location: req.body.to_location,
    to_location_photo_url: req.body.to_location_photo_url,
  });

  ticket
    .save()
    .then((results) => {
      return res.status(200).json({
        response: "Ticket was created successfully",
        ticket: results,
      });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({
        response: "Failed, check your email, password and money balance",
      });
    });
};

module.exports.BUY_TICKET = async function (req, res) {
  try {
    const userInfo = await UserSchema.find({ _id: req.body.user_id }).exec();
    const ticketInfo = await TicketSchema.find({
      _id: req.body.ticket_id,
    }).exec();

    const check_balance =
      userInfo[0].money_balance - ticketInfo[0].ticket_price;

    if (check_balance >= 0) {
      UserSchema.updateOne(
        { _id: req.body.user_id },

        {
          $set: { money_balance: check_balance },
          $push: { bought_tickets: req.body.ticket_id },
        }
      );

      return res.status(200).json({
        statusMessage: "ticket bought succesfully",
        userInfo: userInfo,
      });
    } else {
      return res.status(400).json({ status: "not enough money" });
    }
  } catch (err) {
    return res.status(401).json({ status: " failed" });
  }
};
