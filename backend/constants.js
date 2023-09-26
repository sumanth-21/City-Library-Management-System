// Server Hosting
const HOST = "0.0.0.0";
const PORT = "3000";

// Database Configurations
const DB_DETAILS = {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Auth Token Secret Key
const TOKEN_KEY = process.env.TOKEN_KEY;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;

// Constraints
// const PHONE_NUM = new RegExp("^(+d{1,2}s)?(?d{3})?[s.-]d{3}[s.-]d{4}$");
const BOOK_LIMIT = 10;
const RESERVE_LIMIT = 10;

// User Types
const USER = {
    ADMIN: "admin",
    STUDENT: "student",
    STAFF: "staff",
    SCITIZEN: "scitizen",
};

// Errors
const ERROR = {
    500: "Internal server error. Please retry after some time",
};

const SEARCH_BY = {
    doc_id: "doc_id",
    title: "title",
    publisher: "publisher",
};

// DB Query Constants
const DBQ = {
    BRANCH: "BRANCH",
    BRANCH_ID: "BID",
    BRANCH_NAME: "Name",
    BRANCH_LOCATION: "Location",
    BORROWS: "BORROWS",
    BORROW_FINES: "Fine",
    BORROW_TIME: "BDTime",
    BORROW_RTIME: "RDTime",
    BORROW_ID: "Borrow_ID",
    BORROWED_DOCUMENT_ID: "Doc_Detail",
    COUNT: "COUNT",
    DOCUMENT: "DOCUMENT",
    DOCUMENT_ID: "Doc_ID",
    DOCUMENT_TITLE: "Title",
    DOCUMENT_PDATE: "Pdate",
    DOCUMENT_COPY: "DOC_COPY",
    DOCUMENT_COPY_ID: "UUID",
    DOCUMENT_COPY_NUM: "Copy_No",
    DOCUMENT_COPY_AVAILABLE: "Available",
    PUBLISHER: "PUBLISHER",
    PUBLSIHER_ID: "Publisher_ID",
    PUBLISHER_ADDRESS: "Address",
    PUBLISHER_NAME: "Publisher_Name",
    READER: "READER",
    READER_NAME: "Name",
    READER_TYPE: "Type",
    READER_ID: "Reader_ID",
    READER_PASSWD: "Password",
    READER_ADDRESS: "Address",
    READER_PHONE_NUM: "Phone_NO",
    RESERVES: "RESERVES",
    RESERVE_ID: "Reserve_ID",
    RESERVES_STATUS: "RStatus",
    RESERVES_DOCUMENT_ID: "Doc_Detail",
    RESERVES_TIME: "RDTime",
};

module.exports = {
    DBQ,
    USER,
    HOST,
    PORT,
    ERROR,
    SEARCH_BY,
    DB_DETAILS,
    BOOK_LIMIT,
    RESERVE_LIMIT,
    TOKEN_KEY,
    TOKEN_EXPIRY,
};
