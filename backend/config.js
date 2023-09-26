const mysql = require("mysql");
const winston = require("winston");
const { DB_DETAILS } = require("./constants");

// Initialising Logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

// Connecting MYSQL DB
const db = mysql.createConnection(DB_DETAILS);
db.connect((err) => {
    if (err) {
        logger.error(`MYSQL Connection failed ${err}`);
    } else {
        logger.info(`DB connection success`);
    }
});

db.query(
    `set @@sql_mode ="STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"`
);

module.exports = {
    logger,
    db,
};
