const fs = require('fs');
const PNG = require('pngjs').PNG;
const folderOfGS = __dirname + "/grayScalePhoto/";
const grayScaleFunction = data => {
    return new Promise((resolve, reject) => {
        let i = 1;
        data.forEach(eachPNG => {
            fs.createReadStream(eachPNG)
                .pipe(new PNG({ filterType: 4 }))
                .on("parsed", function() {
                    for (let y = 0; y < this.height; y++) {
                        for (let x = 0; x < this.width; x++) {
                            let idx = (this.width * y + x) << 2;
                            gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
                            this.data[idx] = gray;
                            this.data[idx + 1] = gray;
                            this.data[idx + 2] = gray;
                        }
                    }
                    let outpath = folderOfGS + `GRAYSCALED${i}.png`;
                    console.log(outpath);

                    this.pack().pipe(fs.createWriteStream(outpath));

                    i++;
                })
                .on("error", function() {
                    reject("PNG Files grayScale unsuccessfully! ");
                });
            resolve("Files grayScale successfully!");
        });
    });
};
module.exports = {grayScaleFunction}