const express = require("express");
const router = express.Router();

const { db, logger } = require("../config");
const { DBQ, ERROR, SEARCH_BY } = require("../constants");
const {
    validateNewPublisher,
    validateNewDocument,
    validateNewCopy,
    validateNewReader,
    validateBorrowLimit,
    validateMostBooksBorrow,
    validateBranchFine,
    validateSearchParams,
} = require("../utility");

// Listing all Library Branches
router.get("/branches", (req, res) => {
    db.query(`SELECT * FROM ${DBQ.BRANCH}`, (error, result) => {
        if (error) {
            logger.error(`Error Fetching all branch information - ${error.message}`);
            return res.status(500).json({ error: ERROR[500] });
        }
        logger.info(`Listing all branches`);
        return res.status(200).json({ result });
    });
});

router.get("/publishers", (req, res) => {
    db.query(`SELECT * FROM ${DBQ.PUBLISHER}`, (error, result) => {
        if (error) {
            logger.error(`Error Fetching all publisher information - ${error.message}`);
            return res.status(500).json({ error: ERROR[500] });
        }
        logger.info(`Listing all publishers`);
        return res.status(200).json({ result });
    });
});

// Adding Publisher
router.post("/add/publisher", validateNewPublisher, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.PUBLISHER} (${DBQ.PUBLISHER_NAME}, ${DBQ.PUBLISHER_ADDRESS}) VALUES ("${req.body.name}", "${req.body.address}")`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Publisher - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Publisher added - ${req.body}`);
            return res.status(200).json({ result: `Publisher added` });
        }
    );
});

// Adding Document
router.post("/add/document", validateNewDocument, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.DOCUMENT} (${DBQ.DOCUMENT_TITLE}, ${DBQ.DOCUMENT_PDATE}, ${DBQ.PUBLSIHER_ID}) VALUES ("${req.body.title}", "${req.body.pdate}", ${req.body.publisherID})`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Document - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Document added - ${req.body}`);
            return res.status(200).json({ result: `Document added` });
        }
    );
});

// Adding Document Copy
router.post("/add/copy", validateNewCopy, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.DOCUMENT_COPY} (${DBQ.DOCUMENT_ID}, ${DBQ.DOCUMENT_COPY_NUM}, ${DBQ.BRANCH_ID}) VALUES (${req.body.doc_id}, ${req.body.copy_no}, ${req.body.bid})`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Document Copy - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Document Copy added - ${req.body}`);
            return res.status(200).json({ result: `Document Copy added` });
        }
    );
});

// Adding Reader
router.post("/add/reader", validateNewReader, (req, res) => {
    db.query(
        `INSERT INTO ${DBQ.READER} (${DBQ.READER_NAME}, ${DBQ.READER_PASSWD}, ${DBQ.READER_TYPE}, ${DBQ.READER_ADDRESS}, ${DBQ.READER_PHONE_NUM}) VALUES ("${req.body.name}", "${req.body.password}", "${req.body.type}", "${req.body.address}", "${req.body.phone}")`,
        (error) => {
            if (error) {
                logger.error(`Error Adding Reader - ${error.message}`);
                return res.status(500).json({ error: ERROR[500] });
            }
            logger.info(`Reader added - ${req.body}`);
            return res.status(200).json({ result: `Reader added` });
        }
    );
});

// Most Borrowers
router.post("/stats/most/borrowers", validateBorrowLimit, (req, res) => {
    let query;
    if (req.body.bid) {
        query = `SELECT ${DBQ.READER_NAME}, ${DBQ.READER_PHONE_NUM}, COUNT(*) AS ${DBQ.BORROWS} FROM (SELECT * FROM (SELECT * FROM ${DBQ.DOCUMENT_COPY} WHERE ${DBQ.BRANCH_ID}=${req.body.bid}) T1 JOIN ${DBQ.BORROWS} ON ${DBQ.BORROWED_DOCUMENT_ID}=${DBQ.DOCUMENT_COPY_ID})T2 NATURAL JOIN ${DBQ.READER} GROUP BY ${DBQ.READER_ID} ORDER BY COUNT(*) DESC LIMIT ${req.body.limit};`;
    } else {
        query = `SELECT ${DBQ.READER_NAME}, ${DBQ.READER_PHONE_NUM}, COUNT(*) AS ${DBQ.BORROWS} FROM ${DBQ.BORROWS} NATURAL JOIN ${DBQ.READER} GROUP BY ${DBQ.READER_ID} ORDER BY COUNT(*) DESC LIMIT ${req.body.limit}`;
    }
    db.query(query, (error, result) => {
        if (error) {
            logger.error(`Error Evaluating Most Borrowers - ${error.message}`);
            return res.status(500).json({ error: ERROR[500] });
        }
        logger.info(`Evaluated most borrowers`);
        return res.status(200).json({ result });
    });
});

// Stats Most Borrowed Book
router.post("/stats/most/borrowed/books", validateMostBooksBorrow, (req, res) => {
    let query;
    if (req.body.year) {
        query = `SELECT ${DBQ.DOCUMENT_TITLE}, COUNT(*) AS NO_OF_BORROWS FROM (SELECT * FROM ${DBQ.BORROWS} JOIN ${DBQ.DOCUMENT_COPY} ON ${DBQ.DOCUMENT_COPY_ID}=${DBQ.BORROWED_DOCUMENT_ID} WHERE YEAR(${DBQ.BORROW_TIME})=${req.body.year}) T1 NATURAL JOIN ${DBQ.DOCUMENT} GROUP BY ${DBQ.DOCUMENT_ID} ORDER BY COUNT(*) DESC LIMIT ${req.body.limit};`;
    } else if (req.body.bid) {
        query = `SELECT ${DBQ.DOCUMENT_TITLE}, COUNT(*) AS NO_OF_BORROWS FROM (SELECT * FROM ${DBQ.BORROWS} JOIN ${DBQ.DOCUMENT_COPY} ON ${DBQ.DOCUMENT_COPY_ID}=${DBQ.BORROWED_DOCUMENT_ID} WHERE ${DBQ.BRANCH_ID}=${req.body.bid}) T1 NATURAL JOIN ${DBQ.DOCUMENT} GROUP BY ${DBQ.DOCUMENT_ID} ORDER BY COUNT(*) DESC LIMIT ${req.body.limit};`;
    } else {
        query = `SELECT ${DBQ.DOCUMENT_TITLE}, COUNT(*) AS NO_OF_BORROWS FROM (SELECT * FROM ${DBQ.BORROWS} JOIN ${DBQ.DOCUMENT_COPY} ON ${DBQ.DOCUMENT_COPY_ID}=${DBQ.BORROWED_DOCUMENT_ID}) T1 NATURAL JOIN ${DBQ.DOCUMENT} GROUP BY ${DBQ.DOCUMENT_ID} ORDER BY COUNT(*) DESC LIMIT ${req.body.limit};`;
    }

    db.query(query, (error, result) => {
        if (error) {
            logger.error(`Error Evaluating Most Borrowers - ${error.message}`);
            return res.status(500).json({ error: ERROR[500] });
        }
        logger.info(`Evaluated most borrowers`);
        return res.status(200).json({ result });
    });
});

// Fines paid at Branch
router.post("/fine", validateBranchFine, (req, res) => {
    let query;
    if (req.body.bid) {
        query = `SELECT ${DBQ.BRANCH_NAME}, ${DBQ.BRANCH_LOCATION}, SUM(${DBQ.BORROW_FINES}) AS FINES FROM (SELECT * FROM ${DBQ.BORROWS} JOIN ${DBQ.DOCUMENT_COPY} ON ${DBQ.BORROWED_DOCUMENT_ID}=${DBQ.DOCUMENT_COPY_ID} WHERE ${DBQ.BRANCH_ID}=${req.body.bid}) T1 NATURAL JOIN ${DBQ.BRANCH} GROUP BY ${DBQ.BRANCH_ID} ORDER BY SUM(${DBQ.BORROW_FINES}) DESC`;
    } else {
        query = `SELECT ${DBQ.BRANCH_NAME}, ${DBQ.BRANCH_LOCATION}, CASE WHEN ${DBQ.BORROW_FINES} IS NULL THEN 0 ELSE SUM(${DBQ.BORROW_FINES}) END AS FINES FROM (SELECT * FROM ${DBQ.BORROWS} JOIN ${DBQ.DOCUMENT_COPY} ON ${DBQ.BORROWED_DOCUMENT_ID}=${DBQ.DOCUMENT_COPY_ID}) T1 RIGHT OUTER JOIN ${DBQ.BRANCH} ON T1.${DBQ.BRANCH_ID}=${DBQ.BRANCH}.${DBQ.BRANCH_ID} GROUP BY ${DBQ.BRANCH}.${DBQ.BRANCH_ID} ORDER BY SUM(${DBQ.BORROW_FINES}) DESC`;
    }

    db.query(query, (error, result) => {
        if (error) {
            logger.error(`Error Evaluating Most Fines - ${error.message}`);
            return res.status(500).json({ error: ERROR[500] });
        }
        logger.info(`Evaluated Most Fines`);
        return res.status(200).json({ result });
    });
});

// Search for documents
router.post("/search", validateSearchParams, (req, res) => {
    let query = "";
    if (req.body.searchBy == SEARCH_BY.publisher) {
        query = `SELECT * FROM (SELECT * FROM ${DBQ.DOCUMENT} NATURAL JOIN ${DBQ.PUBLISHER}) T1 NATURAL JOIN ${DBQ.DOCUMENT_COPY} WHERE ${DBQ.PUBLISHER_NAME} LIKE "%${req.body.search}%" AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS ${req.body.available}`;
    } else if (req.body.searchBy == SEARCH_BY.doc_id) {
        query = `SELECT * FROM ${DBQ.DOCUMENT} NATURAL JOIN ${DBQ.DOCUMENT_COPY} WHERE ${DBQ.DOCUMENT_ID}=${req.body.search} AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS ${req.body.available}`;
    } else if (req.body.searchBy == SEARCH_BY.title) {
        query = `SELECT * FROM ${DBQ.DOCUMENT} NATURAL JOIN ${DBQ.DOCUMENT_COPY} WHERE ${DBQ.DOCUMENT_TITLE} LIKE "%${req.body.search}%" AND ${DBQ.DOCUMENT_COPY_AVAILABLE} IS ${req.body.available}`;
    }
    console.log(query)
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

module.exports = {
    router,
};
