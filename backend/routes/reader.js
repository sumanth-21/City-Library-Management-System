const express = require("express");

const { logger, db } = require("../config");
const {
    validateSearchParams,
    validateDocID,
    validateCopyID,
    validateBorrowID,
    validateReserveID,
} = require("../utility");
const { SEARCH_BY, DBQ, BOOK_LIMIT, RESERVE_LIMIT, ERROR } = require("../constants");

const router = express.Router();

router.post("/search", validateSearchParams, (req, res) => {
    let query = "";
    if (req.body.searchBy == SEARCH_BY.publisher) {
        query = `SELECT * FROM ${DBQ.DOCUMENT} NATURAL JOIN ${DBQ.PUBLISHER} WHERE ${DBQ.PUBLISHER_NAME} LIKE "%${req.body.search}%"`;
    } else if (req.body.searchBy == SEARCH_BY.doc_id) {
        query = `SELECT * FROM ${DBQ.DOCUMENT} WHERE ${DBQ.DOCUMENT_ID}=${req.body.search}`;
    } else if (req.body.searchBy == SEARCH_BY.title) {
        query = `SELECT * FROM ${DBQ.DOCUMENT} WHERE ${DBQ.DOCUMENT_TITLE} LIKE "%${req.body.search}%"`;
    }
    db.query(query, (error, result) => {
        if (error) {
            logger.error(`Error in DB Querry ${error.message}`);
            res.status(500).json({ error: ERROR[500] });
        } else {
            logger.info(`Executing query ${query}`);
            res.status(200).json({ result: result });
        }
    });
});

router.post("/document/check", validateDocID, (req, res) => {
    // Checking if document is available
    db.query(
        `SELECT * from ${DBQ.DOCUMENT_COPY} NATURAL JOIN ${DBQ.BRANCH} where ${DBQ.DOCUMENT_ID}=${req.body.doc_id} AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS TRUE`,
        (error, result) => {
            if (error) {
                logger.error(`Error in DB Query - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Finding Available Documents with ID - ${req.body.doc_id}`);
                res.status(200).json({ result: result });
            }
        }
    );
});

router.post("/document/checkout", validateCopyID, (req, res) => {
    // Checking if user is authorised to reserve more books
    db.query(
        `SELECT * from ${DBQ.BORROWS} where ${DBQ.READER_ID}=${req.body.token.uid} AND ${DBQ.BORROW_RTIME} IS NULL LIMIT ${BOOK_LIMIT}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Borrows - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length >= BOOK_LIMIT) {
                logger.info(`User has capped his booking limit. Cannot reserve more books`);
                res.status(403).json({ error: `User has reached borrow limit of ${BOOK_LIMIT}` });
            } else {
                // Checking if document is available
                db.query(
                    `SELECT * from ${DBQ.DOCUMENT_COPY} where ${DBQ.DOCUMENT_COPY_ID}=${req.body.doc_uuid} AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS TRUE`,
                    (error, result) => {
                        if (error) {
                            logger.error(`Error in DB Query - ${error.message}`);
                            res.status(500).json({ error: ERROR[500] });
                        } else if (result.length == 0) {
                            logger.info(`Document copy no longer available for checkout - ${req.body.doc_uuid}`);
                            res.status(200).json({ error: `The document is no longer available` });
                        } else {
                            // Reserving Document
                            db.query(
                                `INSERT INTO ${DBQ.BORROWS} (${DBQ.BORROWED_DOCUMENT_ID}, ${DBQ.READER_ID}) VALUES (${req.body.doc_uuid}, ${req.body.token.uid})`,
                                (error) => {
                                    if (error) {
                                        logger.error(`Error in DB Query - ${error.message}`);
                                        res.status(500).json({ error: ERROR[500] });
                                    } else {
                                        logger.info(`Booking confirmed for document - ${req.body.doc_uuid}`);
                                        res.status(200).json({ result: `Booking confirmed` });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

router.post("/document/return", validateBorrowID, (req, res) => {
    // Returning Document
    db.query(
        `UPDATE ${DBQ.BORROWS} SET ${DBQ.BORROW_RTIME}=(CURRENT_DATE) WHERE ${DBQ.BORROW_ID}=${req.body.borrowID} AND ${DBQ.READER_ID}=${req.body.token.uid}`,
        (error) => {
            if (error) {
                logger.error(`Error returning Docment - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Document returned if exists ${req.body}`);
                res.status(200).json({ result: `Document Successfully returned` });
            }
        }
    );
});

router.post("/document/reserve", validateCopyID, (req, res) => {
    // Checking if user is authorised to reserve more books
    db.query(
        `SELECT * from ${DBQ.RESERVES} where ${DBQ.READER_ID}=${req.body.token.uid} AND ${DBQ.RESERVES_STATUS} IS NULL LIMIT ${RESERVE_LIMIT}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Reserves - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length >= RESERVE_LIMIT) {
                logger.info(`User has capped his reserve limit. Cannot reserve more books`);
                res.status(403).json({ error: `User has reached reserve limit of ${RESERVE_LIMIT}` });
            } else {
                // Checking if document is available
                db.query(
                    `SELECT * from ${DBQ.DOCUMENT_COPY} where ${DBQ.DOCUMENT_COPY_ID}=${req.body.doc_uuid} AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS TRUE`,
                    (error, result) => {
                        if (error) {
                            logger.error(`Error in DB Query - ${error.message}`);
                            res.status(500).json({ error: ERROR[500] });
                        } else if (result.length == 0) {
                            logger.info(`Document copy no longer available for Reservation - ${req.body.doc_uuid}`);
                            res.status(200).json({ error: `The document is no longer available` });
                        } else {
                            // Reserving Document
                            db.query(
                                `INSERT INTO ${DBQ.RESERVES} (${DBQ.RESERVES_DOCUMENT_ID}, ${DBQ.READER_ID}) VALUES (${req.body.doc_uuid}, ${req.body.token.uid})`,
                                (error) => {
                                    if (error) {
                                        logger.error(`Error in DB Query - ${error.message}`);
                                        res.status(500).json({ error: ERROR[500] });
                                    } else {
                                        logger.info(`Reservation confirmed for document - ${req.body.doc_uuid}`);
                                        res.status(200).json({ result: `Reservation confirmed` });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

router.post("/document/reserve/checkout", validateReserveID, (req, res) => {
    // Checking out document already reserved by user
    db.query(
        `SELECT ${DBQ.RESERVES_DOCUMENT_ID} FROM ${DBQ.RESERVES} WHERE ${DBQ.RESERVE_ID}=${req.body.reserveID} AND ${DBQ.READER_ID}=${req.body.token.uid} AND ${DBQ.RESERVES_STATUS} IS NULL`,
        (error, result) => {
            if (error) {
                logger.error(`Error while checking out reserve Document - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == 0) {
                logger.info(`Reservation no longer available ${req.body}`);
                res.status(204).json({ result: "Reservation no longer available" });
            } else {
                // Updating reserve status
                db.query(
                    `UPDATE ${DBQ.RESERVES} SET ${DBQ.RESERVES_STATUS}=TRUE WHERE ${DBQ.RESERVE_ID}=${req.body.reserveID} AND ${DBQ.READER_ID}=${req.body.token.uid}`,
                    (error) => {
                        if (error) {
                            logger.error(`Error updating reserve document status ${req.body} - ${error.message}`);
                            res.status(500).json({ error: ERROR[500] });
                        } else {
                            // Adding to Borrows table
                            db.query(
                                `INSERT INTO ${DBQ.BORROWS} (${DBQ.BORROWED_DOCUMENT_ID}, ${DBQ.READER_ID}) VALUES (${
                                    result[0][DBQ.RESERVES_DOCUMENT_ID]
                                }, ${req.body.token.uid})`,
                                (error) => {
                                    if (error) {
                                        logger.error(
                                            `Error adding reserved document to borrow ${req.body} - ${error.message}`
                                        );
                                        res.status(500).json({ error: ERROR[500] });
                                    } else {
                                        logger.info(
                                            `Document borrowed - ${result[0][DBQ.RESERVES_DOCUMENT_ID]} by ${
                                                req.body.token.uid
                                            }`
                                        );
                                        res.status(200).json({ result: "Document borrow successfully" });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
});

router.get("/status/bookings/reserves", (req, res) => {
    db.query(
        `SELECT ${DBQ.RESERVE_ID}, ${DBQ.BRANCH_NAME}, ${DBQ.BRANCH_LOCATION}, ${DBQ.DOCUMENT_TITLE}, ${DBQ.RESERVES_TIME}, ${DBQ.RESERVES_STATUS} FROM ${DBQ.RESERVES} JOIN (SELECT * FROM ${DBQ.DOCUMENT} NATURAL JOIN (SELECT * FROM ${DBQ.DOCUMENT_COPY} NATURAL JOIN ${DBQ.BRANCH} ) T1) T2 WHERE ${DBQ.RESERVES_DOCUMENT_ID} = ${DBQ.DOCUMENT_COPY_ID} AND ${DBQ.READER_ID}=${req.body.token.uid}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Reserves - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Evaluated user's reserves. UID - ${req.body.token.uid}`);
                res.status(200).json({ result });
            }
        }
    );
});

router.get("/status/bookings/borrows", (req, res) => {
    db.query(
        `SELECT ${DBQ.BORROW_ID}, ${DBQ.BRANCH_NAME}, ${DBQ.BRANCH_LOCATION}, ${DBQ.DOCUMENT_TITLE}, ${DBQ.BORROW_TIME}, ${DBQ.BORROW_RTIME}, ${DBQ.BORROW_FINES} FROM ${DBQ.BORROWS} JOIN (SELECT * FROM ${DBQ.DOCUMENT} NATURAL JOIN (SELECT * FROM ${DBQ.DOCUMENT_COPY} NATURAL JOIN ${DBQ.BRANCH} ) T1) T2 WHERE ${DBQ.BORROWED_DOCUMENT_ID} = ${DBQ.DOCUMENT_COPY_ID} AND ${DBQ.READER_ID}=${req.body.token.uid}`,
        (error, result) => {
            if (error) {
                logger.error(`Error count User's Borrows - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else {
                logger.info(`Evaluated user's reserves UID - ${req.body.token.uid}`);
                res.status(200).json({ result });
            }
        }
    );
});

router.get("/status/fines", (req, res) => {
    db.query(
        `SELECT SUM(${DBQ.BORROW_FINES}) AS ${DBQ.BORROW_FINES} FROM ${DBQ.BORROWS} WHERE ${DBQ.READER_ID}=${req.body.token.uid}`,
        (error, result) => {
            if (error) {
                logger.error(`Error evaluating user's fine - ${error.message}`);
                res.status(500).json({ error: ERROR[500] });
            } else if (result.length == 0) {
                logger.info(`No Borrows hence no fines - ${req.body.token.uid}`);
                res.status(200).json({ result: 0 });
            } else {
                logger.info(`User Dosen't Exists - ${req.body.token.uid}`);
                res.status(200).json({ result: result[0][DBQ.BORROW_FINES] });
            }
        }
    );
});

module.exports = {
    router,
};
