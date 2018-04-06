var config = require("../../config.json").gist
const Gist = require("gist.js")

module.exports = { 
    get: () => {
        return new Promise((resolve) => {
            // re-auth each time because for some reason without this it doesnt work
            var gist = Gist(config.gistID)
                .token(config.gistToken)
            
            gist.get((err, json) => {
                if (err) { 
                    throw new Error(err) 
                }

                var content = JSON.parse(json.files[config.gistFilename].content);
                resolve(content);
            })
        })
    }
}