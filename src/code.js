const fs = require("fs");
const readline = require("readline");
const path = require("path");


const OUTPUT_DIR = path.join(__dirname, "output");
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function extractLogs(logFilePath, date) {
    try {
        const outputFile = path.join(OUTPUT_DIR, `output_${date}.txt`);
        const fileStream = fs.createReadStream(logFilePath, { encoding: "utf-8" });

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        const outputStream = fs.createWriteStream(outputFile, { encoding: "utf-8" });

        for await (const line of rl) {
            if (line.startsWith(date)) {
                outputStream.write(line + "\n");
            }
        }

        outputStream.end();
        console.log(`Logs for ${date} saved in ${outputFile}`);
    } catch (error) {
        console.error(" Error processing the log file:", error);
    }
}


if (process.argv.length !== 3) {
    console.error("Usage: node extract_logs.js YYYY-MM-DD");
    process.exit(1);
}

const date = process.argv[2];
const LOG_FILE_PATH = path.join(__dirname, "logs_2024.log");


extractLogs(LOG_FILE_PATH, date);
