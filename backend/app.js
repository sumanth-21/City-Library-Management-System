const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
const admin = require("./routes/admin");
const reader = require("./routes/reader");
const { logger, db } = require("./config");
const { PORT, DBQ } = require("./constants");
const { generateAccessToken, validateUserToken, validateLogin, validateAdminToken } = require("./utility");

// Creating Express Application
const app = express();
app.use(cors());
app.use(express.json());

// Adding routes
app.use("/reader", validateUserToken, reader.router);
app.use("/admin", validateAdminToken, admin.router);
app.post("/login", validateLogin, (req, res) => {
    db.query(
        `SELECT ${DBQ.READER_PASSWD}, ${DBQ.READER_TYPE} from ${DBQ.READER} where ${DBQ.READER_ID}=${req.body.uid}`,
        (error, result) => {
            if (error) {
                logger.error(`Error in DB Query ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == 1 && result[0][DBQ.READER_PASSWD] == req.body.password) {
                logger.info(`Log in success for ${req.body.uid}`);
                res.status(200).json({
                    result: "success",
                    token: generateAccessToken(result[0][DBQ.READER_TYPE], req.body.uid),
                });
            } else {
                logger.info(`Wrong username/password - '${JSON.stringify(req.body)}'`);
                res.status(404).json({ error: "Invalid id/password. Please re-login" });
            }
        }
    );
});

// Catch and report 404 page requests
app.use(function (req, res) {
    logger.warn(`404 Error Request - ${req}`);
    return res.status(404).json({ error: "URL does not exists" });
});

// Listening for requests
app.listen(PORT);
