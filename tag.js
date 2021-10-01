const vision = require("@google-cloud/vision");

const getLabels = path => {
    let client = new vision.ImageAnnotatorClient({
        keyFilename: "./key.json"
    });
    return client
        .labelDetection(path)
        .then(results => {
            labels = results[0].labelAnnotations;
            let result = labels
                .map(label => {
                    return label.description;
                })
                .sort();
            return JSON.stringify(result);
        })
        .catch(err => {
            console.error("ERROR:", err);
        });
};

module.exports = { getLabels };
