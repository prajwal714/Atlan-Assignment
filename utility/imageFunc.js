const Path=require('path');
const sharp = require("sharp");
const Fs = require("fs");
const axios = require("axios");


//function to download and store image from given url
async function downloadImage(url) {
    const path = Path.resolve(__dirname, "../images", "test.jpg");
    const writer = Fs.createWriteStream(path);

    const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        console.log(resolve);
        writer.on("finish", resolve(path));
        writer.on("error", reject("error occured while downloading"));
    });
}

//function to resize the image and store it in public directory
async function resize(inputFile, outputFile) {
    console.log(inputFile);
    console.log(outputFile);
    const inStream = Fs.createReadStream(inputFile);
    const outStream = Fs.createWriteStream(outputFile, { flags: "w" });

    outStream.on("error", () => {
        console.log("error")
        return;
    });
    outStream.on("close", () => console.log("Successfully saved file"));

    let resizedImage = sharp()
        .resize({ width: 50, height: 50 })
        .on("info", fileInfo =>
            console.log("resizizing done, file not saved yet", fileInfo)
        );

    inStream.pipe(resizedImage).pipe(outStream);

    return new Promise((resolve, reject) => {
        resolve(outputFile);
        reject("Error while resizing");
    });
}

exports.resize=resize;
exports.downloadImage=downloadImage;