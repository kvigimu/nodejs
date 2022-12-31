const UserSchema = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.SING_UP = async function (req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const upperCaseName =
    req.body.name.charAt(0).toUpperCase() +
    req.body.name.slice(1).toLowerCase();
  const user = new UserSchema({
    name: upperCaseName,
    email: req.body.email,
    password: hashedPassword,
    bought_tickets: [],
    money_balance: req.body.money_balance,
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  user
    .save()
    .then((results) => {
      return res.status(200).json({
        response: "User was created successfully",
        user: results,
        token,
        refreshToken,
      });
    })
    .catch((err) => {
      {
        console.log("err", err);
        res.status(400).json({
          response: "Failed, check your email, password and money balance",
        });
      }
    });
};

module.exports.LOGIN = async function (req, res) {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });

    const doesPasswordsMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (doesPasswordsMatch) {
      const token = jwt.sign(
        {
          email: req.body.email,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" },
        { algorythm: "RS256" }
      );
      const refreshToken = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
        { algorythm: "RS256" }
      );
      return res.status(200).json({
        status: "login successful",
        jwt_token: token,
        jwt_refresh_token: refreshToken,
      });
    }
    return res.status(404).json({ status: "wrong email or passwordlogin" });
  } catch (err) {
    console.log("req.body", req.body);
    console.log(("err", err));
    return res.status(401).json({ status: "login failed" });
  }
};

module.exports.GET_NEW_JWT_TOKEN = function (req, res) {
  const refreshToken = req.body.refreshToken;

  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err) {
      const user = await UserSchema.findById(decoded.userId);
      if (!user) {
        return res.status(400).json({ status: "login again" });
      } else {
        const new_jwt_token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );

        return res
          .status(200)
          .json({ refreshToken: refreshToken, new_jwt_token });
      }
    } else {
      return res.status(400).json({ status: "bad token" });
    }
  });
};

module.exports.GET_ALL_USERS = async function (req, res) {
  const data = await UserSchema.find().exec();

  data.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  console.log(data);
  return res.status(200).json({ "All users:": data });
};

module.exports.GET_USER_BY_ID = function (req, res) {
  UserSchema.find({ _id: req.params.id })
    .then((results) => {
      return res.status(200).json({ user: results });
    })
    .catch((err) => {
      return res.status(404).json({ error: "user not found" });
    });
};
