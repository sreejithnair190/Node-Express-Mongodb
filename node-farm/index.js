const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

const temp_overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const temp_product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const temp_card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) =>{
    
    const {query, pathname} = url.parse(req.url, true);
    
    // Product Page
    if (pathname === "/product") {
        res.writeHead(200, {"Content-type":"text/html"});

        const product = dataObj[query.id];
        const output = replaceTemplate(temp_product, product);
        res.end(output);        
    }
    
    // Overview Page
    else if (pathname === "/overview" || pathname === "/") {
        res.writeHead(200, {"Content-type":"text/html"});
        const cards =  dataObj.map(card => replaceTemplate(temp_card,card)).join('');
        const output = temp_overview.replace(/{% PRODUCT_CARDS %}/g, cards);

        res.end(output);
    }

    // APi
    else if(pathname === "/api"){
        res.writeHead(200,{'Content-type':'application/json'})
        res.end(data);
    }

    // 404
    else{
        res.writeHead(
            404,
            {"content-type":'text/html'}
        );
        res.end("Page Not Found");
    }
});

server.listen(8000,() => console.log("Server Has Been Started"));