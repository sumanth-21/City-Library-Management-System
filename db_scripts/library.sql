DROP DATABASE LIBRARY;
CREATE DATABASE LIBRARY;
USE LIBRARY;

CREATE TABLE BRANCH(
    BID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(40),
    Location VARCHAR(200)
);

CREATE TABLE PUBLISHER(
    Publisher_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Publisher_Name VARCHAR(40),
    Address varchar(200)
);

CREATE TABLE DOCUMENT(
    Doc_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(40),
    PDate DATE,
    Publisher_ID INTEGER,
    CONSTRAINT DOCUMENT_PUBLISHER FOREIGN KEY (Publisher_ID) REFERENCES PUBLISHER(Publisher_ID)
);

CREATE TABLE DOC_COPY(
    UUID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Doc_ID INTEGER NOT NULL,
    Copy_No INTEGER NOT NULL,
    BID INTEGER NOT NULL,
    Available BOOLEAN DEFAULT TRUE,
    CONSTRAINT DCOPY_DOCUMENT FOREIGN KEY (Doc_ID) REFERENCES DOCUMENT(Doc_ID),
    CONSTRAINT DCOPY_BRANCH FOREIGN KEY (BID) REFERENCES BRANCH(BID)
);

CREATE TABLE PERSON(
    PID INTEGER AUTO_INCREMENT PRIMARY KEY,
    PName VARCHAR(40)
);

CREATE TABLE PROCEEDINGS(
    Doc_ID INTEGER PRIMARY KEY,
    Date DATE,
    Location VARCHAR(200),
    CONSTRAINT PROCEEDINGS_DOCUMENT FOREIGN KEY (Doc_ID) REFERENCES DOCUMENT(Doc_ID)
);

CREATE TABLE CHAIRS(
    Doc_ID INTEGER NOT NULL,
    PID INTEGER NOT NULL,
    CONSTRAINT CHAIRS_PRIMARY_KEY PRIMARY KEY(Doc_ID, PID),
    CONSTRAINT CHAIRS_DOCUMENT FOREIGN KEY(Doc_ID) REFERENCES DOCUMENT(Doc_ID),
    CONSTRAINT CHAIRS_PERSON FOREIGN KEY(PID) REFERENCES PERSON(PID)
);

CREATE TABLE JOURNAL_VOLUME(
    JID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Doc_ID INTEGER NOT NULL,
    Volume_NO INTEGER NOT NULL,
    Editor INTEGER NOT NULL,
    CONSTRAINT JVOLUME_DOCUMENT FOREIGN KEY(Doc_ID) REFERENCES DOCUMENT(Doc_ID),
    CONSTRAINT JVOLUME_PERSON FOREIGN KEY(Editor) REFERENCES PERSON(PID)
);

CREATE TABLE JOURNAL_ISSUE(
    Volume INTEGER NOT NULL,
    Scope VARCHAR(500),
    Issue_NO INTEGER NOT NULL,
    CONSTRAINT JISSUE_PRIMARY_KEY PRIMARY KEY(Volume, Issue_NO),
    CONSTRAINT JISSUE_JVOLUME FOREIGN KEY(Volume) REFERENCES JOURNAL_VOLUME(JID)
);

CREATE TABLE GUEST_EDITORS(
    Volume INTEGER NOT NULL,
    Issue_NO INTEGER NOT NULL,
    GEditor INTEGER NOT NULL,
    CONSTRAINT GEDITORS_PRIMARY_KEY PRIMARY KEY(Volume, Issue_NO, GEditor),
    CONSTRAINT GEDITORS_JVOLUME FOREIGN KEY (Volume) REFERENCES JOURNAL_VOLUME(JID),
    CONSTRAINT GEDITORS_PERSON FOREIGN KEY(GEditor) REFERENCES PERSON(PID)
);

CREATE TABLE BOOK(
    Doc_ID INTEGER NOT NULL PRIMARY KEY,
    ISBN INTEGER NOT NULL,
    CONSTRAINT BOOK_DOCUMENT FOREIGN KEY(Doc_ID) REFERENCES DOCUMENT(Doc_ID)
);

CREATE TABLE AUTHOR(
    PID INTEGER NOT NULL,
    Doc_ID INTEGER NOT NULL,
    CONSTRAINT AUTHOR_PRIMARY_KEY PRIMARY KEY(PID, Doc_ID),
    CONSTRAINT AUTHOR_PERSON FOREIGN KEY(PID) REFERENCES PERSON(PID),
    CONSTRAINT AUTHOR_DOCUMENT FOREIGN KEY(Doc_ID) REFERENCES DOCUMENT(Doc_ID)
);

CREATE TABLE READER(
    Reader_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Password VARCHAR(20) NOT NULL,
    Type VARCHAR(20) NOT NULL,
    Name VARCHAR(20) NOT NULL,
    Address VARCHAR(200),
    Phone_NO CHAR(14),
    CONSTRAINT CHK_PHONE CHECK (Phone_NO not like '^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$')
);

CREATE TABLE BORROWS(
    Borrow_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Doc_Detail INTEGER NOT NULL,
    Reader_ID INTEGER NOT NULL,
    BDTime DATE DEFAULT (CURRENT_DATE),
    RDTime DATE,
    Fine INTEGER DEFAULT 0,
    CONSTRAINT BORROWS_READER FOREIGN KEY(Reader_ID) REFERENCES READER(Reader_ID),
    CONSTRAINT BORROWS_DCOPY FOREIGN KEY(Doc_Detail) REFERENCES DOC_COPY(UUID)
);

CREATE TABLE RESERVES(
    Reserve_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    Reader_ID INTEGER NOT NULL,
    Doc_Detail INTEGER NOT NULL,
    RDTime DATE DEFAULT (CURRENT_DATE),
    RStatus BOOLEAN DEFAULT NULL,
    CONSTRAINT RESERVE_READER FOREIGN KEY(Reader_ID) REFERENCES READER(Reader_ID),
    CONSTRAINT RESERVE_DCOPY FOREIGN KEY(Doc_Detail) REFERENCES DOC_COPY(UUID)
);

INSERT INTO BRANCH(Name, Location) VALUES
    ("Bronx  Library Center", "New York"),
    ("Westchester Square Library", "New York"),
    ("St. George Library Center", "New York"),
    ("Irvington Public Library", "New Jersey"),
    ("Elizabeth Public Library", "New Jersey");

INSERT INTO PUBLISHER(Publisher_Name, Address) VALUES
    ("Hachette Book Group", "6th Ave, New York, NY 10104"),
    ("HarperCollins", "195 Broadway, New York, NY 10007"),
    ("Macmillan Publishers", "120 Broadway, New York, NY 10271"),
    ("Penguin Random House", "1745 Broadway, New York, NY 10019"),
    ("Simon and Schuster", "1230 6th Ave, New York, NY 10020");

INSERT INTO DOCUMENT(Title, PDate, Publisher_ID) VALUES
    ("Harry Potter and the Half-Blood Prince", "2008-11-11", 1),
    ("Harry Potter and the Order of Phoenix", "2007-11-24", 1),
    ("Harry Potter and the Chamber of Secrets", "2006-05-20", 1),
    ("Harry Potter and the Prisoner of Azkaban", "2005-11-13", 1),
    ("A Short History of Nearly Everything", "2008-01-10", 2),
    ("Bill Bryson's African Diary", "2015-12-25", 2),
    ("The Lost Continent", "2012-03-12", 3),
    ("Notes from a Small Island", "2005-12-31", 3),
    ("The Lord of the Rings", "1999-05-20", 4),
    ("Agile Web Development with Rails", "2008-11-15", 4),
    ("Heidi", "2016-11-11", 5),
    ("God Emperor of Dune", "2020-10-25", 5);

INSERT INTO DOC_COPY(Doc_ID, Copy_No, BID) VALUES
    (1, 1, 1),
    (1, 2, 1),
    (1, 3, 1),
    (1, 1, 2),
    (1, 2, 2),
    (1, 3, 2),
    (1, 1, 3),
    (1, 2, 3),
    (1, 3, 3),
    (2, 1, 4),
    (2, 2, 4),
    (2, 3, 4),
    (2, 1, 5),
    (2, 2, 5),
    (2, 3, 5),
    (2, 1, 1),
    (2, 2, 1),
    (2, 3, 1),
    (3, 1, 2),
    (3, 2, 2),
    (3, 3, 2),
    (3, 1, 3),
    (3, 2, 3),
    (3, 3, 3),
    (4, 1, 4),
    (4, 2, 4),
    (4, 3, 4),
    (4, 1, 5),
    (4, 2, 5),
    (4, 3, 5),
    (5, 1, 1),
    (6, 1, 2),
    (7, 1, 3),
    (8, 1, 4),
    (9, 1, 5),
    (10, 1, 1),
    (11, 1, 2),
    (12, 1, 3);

INSERT INTO PERSON(PNAME) VALUES
    ("J.K. Rowling"),
    ("Bill Bryson"),
    ("J.R.R. Tolkien"),
    ("Dave Thomas"),
    ("Johanna Spyri"),
    ("Frank Herbert");

INSERT INTO PROCEEDINGS(Doc_ID, Date, Location) VALUES
    (1, "2012-03-12", "6th Ave, New York, NY 10104"),
    (2, "2012-10-09", "7th Ave, New York, NY 10104"),
    (3, "2012-04-23", "8th Ave, New York, NY 10104"),
    (4, "2012-06-19", "9th Ave, New York, NY 10104"),
    (5, "2012-08-15", "10th Ave, New York, NY 10104");

INSERT INTO CHAIRS(Doc_ID, PID) VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 2),
    (6, 2);

INSERT INTO JOURNAL_VOLUME(Doc_ID, Volume_NO, Editor) VALUES
    (10, 1, 4),
    (10, 2, 4),
    (10, 3, 4),
    (11, 1, 5),
    (11, 2, 5),
    (12, 1, 6),
    (12, 2, 6);

INSERT INTO JOURNAL_ISSUE(Volume, Scope, Issue_NO) VALUES
    (1, "covers front-end web development", 1),
    (2, "covers back-end web development", 2),
    (3, "covers Full stack web development", 3),
    (4, "A tale that covers seven generations of three families - past", 1),
    (5, "A tale that covers seven generations of three families - present", 1),
    (6, "Introduction of God Emperor", 1),
    (7, "God Emperor the End", 1);

INSERT INTO GUEST_EDITORS(Volume, Issue_NO, GEditor) VALUES
    (1, 1, 1),
    (2, 2, 2),
    (4, 1, 3),
    (5, 1, 4),
    (6, 1, 5);

INSERT INTO BOOK(Doc_ID, ISBN) VALUES
    (1, 978-3-16-148410-0),
    (2, 979-3-16-148410-0),
    (3, 971-3-16-148410-0),
    (4, 972-3-16-148410-0),
    (5, 973-3-16-148410-0),
    (6, 974-3-16-148410-0),
    (7, 975-3-16-148410-0);

INSERT INTO AUTHOR(PID, Doc_ID) VALUES
    (3, 7),
    (3, 8),
    (3, 9),
    (4, 10),
    (5, 11),
    (6, 12);

INSERT INTO READER(Password, Type, Name, Address, Phone_NO) VALUES
    ("password", "admin", "Karan", "NJIT", 7897897897),
    ("password1", "student", "Satyam", "NJIT", 7878787878);

delimiter |

-- Add Trigger to Unreserve Document everyday @ 6 PM
DROP EVENT IF EXISTS RESET_RESERVES;

CREATE EVENT IF NOT EXISTS RESET_RESERVES
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE)+ INTERVAL 1 DAY + INTERVAL 18 HOUR) 
DO 
    BEGIN
        UPDATE DOC_COPY SET Available=TRUE WHERE UUID IN (SELECT DOC_DETAIL FROM RESERVES WHERE RStatus IS NULL);
        UPDATE RESERVES SET RStatus=FALSE WHERE RStatus IS NULL;
    END |

-- Add Trigger to release Document on Reservation cancel
DROP TRIGGER IF EXISTS BOOK_RESERVE_CANCEL;

CREATE TRIGGER BOOK_RESERVE_CANCEL
AFTER INSERT ON RESERVES
FOR EACH ROW 
BEGIN
    UPDATE DOC_COPY SET Available=FALSE WHERE UUID=NEW.Doc_Detail;
END |

-- Trigger to update Document_Copy status after borrow
DROP TRIGGER IF EXISTS BOOK_BORROWED;

CREATE TRIGGER BOOK_BORROWED
AFTER INSERT ON BORROWS
FOR EACH ROW 
BEGIN
    UPDATE DOC_COPY SET Available=FALSE WHERE UUID=NEW.Doc_Detail;
END |

-- Add Trigger to make COPY available on document return
DROP TRIGGER IF EXISTS RETURNING_BOOK;

CREATE TRIGGER RETURNING_BOOK
AFTER UPDATE ON BORROWS 
FOR EACH ROW
BEGIN
    IF (NEW.RDTime IS NOT NULL) THEN
        UPDATE DOC_COPY SET Available=TRUE WHERE UUID=NEW.Doc_Detail;
    END IF ;
END |

-- Add Trigger to calculate fine
DROP TRIGGER IF EXISTS CALCULATE_FINE;

CREATE TRIGGER CALCULATE_FINE
BEFORE UPDATE ON BORROWS
FOR EACH ROW
BEGIN
    IF (NEW.RDTime IS NOT NULL) THEN
        SET NEW.FINE = GREATEST(DATEDIFF(NEW.RDTime, NEW.BDTime)-7, 0)*10;
    END IF;
END |

delimiter ;