const jwt = require("jsonwebtoken");

const { db, logger } = require("./config");
const { DBQ, TOKEN_EXPIRY, TOKEN_KEY, USER, SEARCH_BY } = require("./constants");

// Generate Access Token
const generateAccessToken = (permission, uid) => {
    return jwt.sign(
        {
            uid: uid,
            permission: permission,
        },
        TOKEN_KEY,
        { expiresIn: TOKEN_EXPIRY }
    );
};

// Verify Access Token
const validateUserToken = (req, res, next) => {
    if (typeof req.headers["authorization"] !== "string") {
        logger.error(`Invalid token in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Invalid Token. Please login again" });
    } else {
        try {
            req.body.token = jwt.verify(req.headers["authorization"].split(" ")[1], TOKEN_KEY);
        } catch (err) {
            logger.error(`Error validating JWT from request. Err - ${err}`);
            return res.status(401).json({ error: "JWT Token unauthorised - reissue required." });
        }
    }
    next();
};

// Validate Admin's Token
const validateAdminToken = (req, res, next) => {
    if (typeof req.headers["authorization"] !== "string") {
        logger.error(`Invalid token in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Invalid Token. Please login again" });
    } else {
        try {
            req.body.token = jwt.verify(req.headers["authorization"].split(" ")[1], TOKEN_KEY);
            if (req.body.token.permission !== USER.STAFF && req.body.token.permission !== USER.ADMIN) {
                logger.warn(`Unauthorised user token access - ${req.body}`);
                return res.status(403).json({ error: `Unauthorised access.` });
            }
        } catch (err) {
            logger.error(`Error validating JWT from request. Err - ${err}`);
            return res.status(401).json({ error: "JWT Token unauthorised - reissue required." });
        }
    }
    next();
};

// Validating user's ID
const validateLogin = (req, res, next) => {
    if ((typeof req.body.uid !== "number" && isNaN(req.body.uid)) || typeof req.body.password !== "string") {
        logger.error(`Invalid value for 'login' in body - ${req.body}`);
        return res.status(400).json({
            error: "Missing/Invalid values. Expected - { 'uid': 'Must be number', 'password': 'Must be non-empty string'}",
        });
    }
    next();
};

// Validating params for Search in Documents
const validateSearchParams = (req, res, next) => {
    console.log(req.body)
    if (typeof req.body.search !== "string" || !(req.body.searchBy in SEARCH_BY)) {
        logger.error(`Invalid value for search params - ${req.body}`);
        return res.status(400).json({
            error: `Missing/Invalid. { 'search' : 'must be string', 'searchBy': '${SEARCH_BY.doc_id} || ${SEARCH_BY.title} || ${SEARCH_BY.publisher}'`,
        });
    }
    if (typeof req.body.available == "undefined") {
        req.body.available = "NOT NULL";
        console.log("!@#!@#!@#!@#!#!@#!@#!@#!@#")
    } else if (typeof req.body.available !== "boolean") {
        logger.error(`Invalid value for search params - ${req.body}`);
        return res.status(400).json({
            error: `Missing/Invalid. { 'search' : 'string', 'searchBy': '${SEARCH_BY.doc_id} || ${SEARCH_BY.title} || ${SEARCH_BY.publisher}', 'available': 'boolean' }`,
        });
    }
    next();
};

// Valudating Document ID
const validateDocID = (req, res, next) => {
    if (typeof req.body.doc_id !== "number") {
        logger.error(`Invalid value for 'DOC_ID' in body - ${req.body.doc_id}`);
        return res.status(400).json({ error: "Missing/Invalid value for 'doc_id'. Must be number" });
    }
    next();
};

// Validting Document Copy ID
const validateCopyID = (req, res, next) => {
    if (typeof req.body.doc_uuid !== "number") {
        logger.error(`Invalid value for doc_uuid in body - ${req.body.doc_uuid}`);
        return res.status(400).json({ error: "Missing/Invalid value for 'doc_uuid'. Must be number" });
    }
    next();
};

// Validating BorrowID
const validateBorrowID = (req, res, next) => {
    if (typeof req.body.borrowID !== "number") {
        logger.error(`Invalid value for 'borrowID' in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Invalid value for 'borrowID'. Must be a number" });
    }
    next();
};

// Validating ReserveID
const validateReserveID = (req, res, next) => {
    if (typeof req.body.reserveID !== "number") {
        logger.error(`Invalid value for 'reserveID' in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Invalid value for 'reserveID'. Must be number" });
    }
    next();
};

// Verifying Publisher with given ID Exists
const verifyPublisherExists = (pid) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${DBQ.PUBLISHER} WHERE ${DBQ.PUBLSIHER_ID} = ${pid}`, (error, result) => {
            if (error) {
                logger.error(`Error checking Publisher - ${error.message}`);
                reject({ status: 500, error: ERROR[500] });
            } else if (result.length == 0) {
                logger.warn(`Publisher does not exists. ID - ${pid}`);
                reject({ status: 400, error: `Publisher does not exists` });
            } else {
                logger.info(`Publisher exists`);
                resolve();
            }
        });
    });
};

// Verifying Document with givem ID Exists
const verifyDocumentExists = (doc_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${DBQ.DOCUMENT} WHERE ${DBQ.DOCUMENT_ID} = ${doc_id}`, (error, result) => {
            if (error) {
                logger.error(`Error checking Document - ${error.message}`);
                reject({ status: 500, error: ERROR[500] });
            } else if (result.length == 0) {
                logger.warn(`Document does not exists. ID - ${doc_id}`);
                reject({ status: 400, error: `Document does not exists` });
            } else {
                logger.info(`Document exists`);
                resolve();
            }
        });
    });
};

// Verifying Document with givem ID Exists
const verifyBranchExists = (bid) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${DBQ.BRANCH} WHERE ${DBQ.BRANCH_ID} = ${bid}`, (error, result) => {
            if (error) {
                logger.error(`Error checking Branch - ${error.message}`);
                reject({ status: 500, error: ERROR[500] });
            } else if (result.length == 0) {
                logger.warn(`Branch does not exists. ID - ${bid}`);
                reject({ status: 400, error: `Branch does not exists` });
            } else {
                logger.info(`Branch exists`);
                resolve();
            }
        });
    });
};

// Verifying combination of Branch, Copy_No & DocumentID is unique
const verifyCopyNotDuplicate = (doc_id, bid, copy_no) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM ${DBQ.DOCUMENT_COPY} WHERE ${DBQ.BRANCH_ID}=${bid} AND ${DBQ.DOCUMENT_ID}=${doc_id} AND ${DBQ.DOCUMENT_COPY_NUM}=${copy_no}`,
            (error, result) => {
                if (error) {
                    logger.error(`Error checking Document Copy Uniqueness - ${error.message}`);
                    reject({ status: 500, error: ERROR[500] });
                } else if (result.length == 0) {
                    logger.info(`Copy is unique`);
                    resolve();
                } else {
                    logger.warn(`Copy is not unique. BID - ${bid}, doc_id - ${doc_id}, Cpy# - ${copy_no}`);
                    reject({ status: 400, error: `Document with given 'copy_no' already exists at Branch` });
                }
            }
        );
    });
};

// Validating New Publisher Values
const validateNewPublisher = (req, res, next) => {
    if (typeof req.body.name !== "string" || typeof req.body.address !== "string") {
        logger.error(`Invalid value for '/add/publisher' in body - ${req.body}`);
        return res.status(400).json({ error: "Missing/Invalid value. {'name': 'string', 'address': 'string'}" });
    }
    next();
};

// Validating New Document Values
const validateNewDocument = (req, res, next) => {
    if (
        typeof req.body.title !== "string" ||
        typeof req.body.pdate !== "string" ||
        typeof req.body.publisherID !== "number"
    ) {
        logger.error(`Invalid value for '/add/document' in body - ${req.body}`);
        return res.status(400).json({
            error: "Missing/Invalid value. {'title': 'string', 'pdate': 'string - YYYY-MM-DD', 'publisherID': 'number'}",
        });
    }
    verifyPublisherExists(req.body.publisherID)
        .then(() => {
            next();
        })
        .catch((error) => {
            return res.status(error.status).json({ error: error.error });
        });
};

// Validating New Copy Values
const validateNewCopy = (req, res, next) => {
    if (
        typeof req.body.doc_id !== "number" ||
        typeof req.body.bid !== "number" ||
        typeof req.body.copy_no !== "number"
    ) {
        logger.error(`Invalid value for '/add/copy' in body - ${req.body}`);
        return res
            .status(400)
            .json({ error: "Missing/Invalid value. {'doc_id': 'number', 'bid': 'number', 'copy_no': 'number'}" });
    }
    verifyBranchExists(req.body.bid)
        .then(() => {
            return verifyDocumentExists(req.body.doc_id);
        })
        .then(() => {
            return verifyCopyNotDuplicate(req.body.doc_id, req.body.bid, req.body.copy_no);
        })
        .then(() => {
            logger.info("New Document Copy Validated");
            next();
        })
        .catch((error) => {
            return res.status(error.status).json({ error: error.error });
        });
};

// Validating New Reader
const validateNewReader = (req, res, next) => {
    if (
        typeof req.body.name !== "string" ||
        typeof req.body.password !== "string" ||
        typeof req.body.address !== "string" ||
        typeof req.body.phone !== "string" ||
        // !PHONE_NUM.test(req.body.phone) ||
        typeof req.body.type !== "string" ||
        (req.body.type !== USER.STUDENT && req.body.type !== USER.STAFF && req.body.type !== USER.SCITIZEN)
    ) {
        logger.error(`Invalid value for '/add/reader' in body - ${req.body}`);
        return res.status(400).json({
            error: `Missing/Invalid value. {'name': 'string', 'password': 'string', 'phone': 'string', 'type': 'admin || staff || scitizen'}`,
        });
    }
    next();
};

const validateBorrowLimit = (req, res, next) => {
    if (
        typeof req.body.limit !== "number" ||
        (typeof req.body.bid !== "undefined" && typeof req.body.bid !== "number")
    ) {
        logger.error(`Invalid value for '/most/borrow' in body - ${req.body}`);
        return res
            .status(400)
            .json({ error: "Missing/Invalid value. {'limit': 'number > 0', 'bid': 'number [OPTIONAL]'}" });
    }
    next();
};

const validateMostBooksBorrow = (req, res, next) => {
    if (
        typeof req.body.limit !== "number" ||
        (typeof req.body.year !== "undefined" && typeof req.body.year !== "number") ||
        (typeof req.body.bid !== "undefined" && typeof req.body.bid !== "number")
    ) {
        logger.error(`Invalid value for '/most/borrow/books' in body - ${req.body}`);
        return res.status(400).json({
            error: "Missing/Invalid value. {'limit': 'number > 0', 'year': 'number [OPTIONAL]', 'bid': 'number [OPTIONAL]'}",
        });
    }
    next();
};

const validateBranchFine = (req, res, next) => {
    if (typeof req.body.bid !== "undefined" && typeof req.body.bid !== "number") {
        logger.error(`Invalid value for '/admin/fine' in body - ${req.body}`);
        return res.status(400).json({
            error: "Missing/Invalid value. {'bid': 'number [OPTIONAL]'}",
        });
    }
    next();
};

module.exports = {
    validateDocID,
    validateLogin,
    validateCopyID,
    validateBorrowID,
    validateReserveID,
    validateUserToken,
    validateAdminToken,
    generateAccessToken,
    validateSearchParams,
    validateNewCopy,
    validateNewReader,
    validateBranchFine,
    validateNewDocument,
    validateBorrowLimit,
    validateNewPublisher,
    validateMostBooksBorrow,
};
