const fs = require('fs');
const superagent = require('superagent');

// Callback Hell
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {

    superagent
        .get(`https://dog.ceo/api/breed/${data}/images`)
        .end((err,res) => {
            
            fs.writeFile('dog-image.txt', res.body.message[0], err => {
                err 
                    ? console.log(err)
                    : console.log('Random Image saved to file!');;
            });

        });
});
*/

// Promises
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    superagent
        .get(`https://dog.ceo/api/breed/${data}/images`)
        .then( res => {
            fs.writeFile('dog-image.txt', res.body.message[0], err => {
                err ? console.log(err) : console.log('Random Image saved to file!');
            });
        })
        .catch(err => console.log(err.message));
});
