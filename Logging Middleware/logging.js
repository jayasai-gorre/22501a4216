// import fs from "fs";

// const logToFile = ({name, location, mainUrl, shortenedUrl, expiresAt}) => {
//     const timeStamp = new Date().toISOString();
//     const logEntry = `[${timeStamp}] name=${name} location=${location} mailUrl=${mainUrl} shortenedUrl=${shortenedUrl} expiresAt=${expiresAt}\n`;

//     fs.appendFile("log.txt", logEntry, throwErrorHandler);
// }

// const throwErrorHandler = (err) => {
//     if (err) throw err;
// }

// export default logToFile;

import fs from "fs";

const throwErrorHandler = (err) => {
    if (err) throw err;
};

const logToFile = ({name, location, mainUrl, shortenedUrl, expiresAt}) => {
    const timeStamp = new Date().toISOString();
    const logEntry = `[${timeStamp}] name=${name} location=${location} mainUrl=${mainUrl} shortenedUrl=${shortenedUrl} expiresAt=${expiresAt}\n`;

    fs.appendFile("log.txt", logEntry, throwErrorHandler);
};

export default logToFile;