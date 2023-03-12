module.exports = (template, product) => {
    let output = template.replace(/{% PRODUCT_NAME %}/g, product.productName);
        output = output.replace(/{% PRODUCT_IMAGE %}/g, product.image);
        output = output.replace(/{% PRODUCT_QUANTITY %}/g, product.quantity);
        output = output.replace(/{% PRODUCT_PRICE %}/g, product.price);
        output = output.replace(/{% PRODUCT_ID %}/g, product.id);
        output = output.replace(/{% PRODUCT_DESCRIPTION %}/g, product.description);
        output = output.replace(/{% PRODUCT_FROM %}/g, product.from);
        output = output.replace(/{% PRODUCT_NUTRIENTS %}/g, product.nutrients);
        output = (!product.organic) 
                    ? output.replace(/{% PRODUCT_NOT_ORGANIC %}/g, 'not-organic')
                    : output.replace(/{% PRODUCT_NOT_ORGANIC %}/g, '')
    return output;
}
