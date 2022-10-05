const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

const missingProductKeyError = (key) => ({ error: `request body missing non-null "${key}" property` });

router.get('/', async (_, res) => {
  try {                                       // try to
    const products = await Product.findAll({    // find all products
      include: [Category, Tag]                    // include associated categories and tags
    });

    res.status(200);                            // respond with 200 - OK
    res.json(products);                         // respond with found products as JSON
  } catch(err) {                              // catch errors
    res.status(500);                            // respond with 500 - Internal Server Error
    res.json(err);                              // respond with error as JSON
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;                      // deconstruct URL params
  try {                                           // try to
    const product = await Product.findByPk(id, {    // find product by ID
      include: [Category, Tag]
    });

    if(!product) {                                  // if not found 
      res.sendStatus(404);                            // respond with 404 - Not Found
      return;                                         // return
    }

    res.status(200);                                // respond with 200 - OK
    res.json(product);                              // respond with found product as JSON
  } catch(err) {                                  // catch errors
    res.status(500);                                // respond with 500 - Internal Server Error
    res.json(err);                                  // respond with error as JSON
  }
});

router.post('/', async (req, res) => {
  const body = req.body;                                                // parse request body

  if(!body.product_name) {                                              // if product_name missing
    res.status(400);                                                      // respond with 400 - Bad Request
    res.json(missingProductKeyError('product_name'));                     // respond with error JSON
    return;                                                               // return
  }
  if(!body.price) {                                                     // if price missing
    res.status(400);                                                      // respond with 400 - Bad Request
    res.json(missingProductKeyError('price'));                            // respond with error JSON
    return;                                                               // return
  }
  if(!body.stock) {                                                     // if stock missing
    res.status(400);                                                      // respond with 400 - Bad Request
    res.json(missingProductKeyError('stock'));                            // respond with error JSON
    return;                                                               // return
  }

  const transaction = await sequelize.transaction();                    // create transaction to rollback if necessary

  try {                                                                 // try to
    const product = await Product.create(body, { transaction });          // create product using request body
    let responseBody = product;                                           // set the response body to be the product created

    if(!body.tagIds && body.tagIds.length > 0) {                          // if tagIds in request body and the length is greater than 0
      const productTagIdArr = body.tagIds.map(tag_id => {                   // map tagIds in request body by...
        return { product_id: product.id, tag_id };                          // an object containing product_id = product.id + the tag_id itself
      });
      responseBody = await ProductTag.bulkCreate(                           // bulkCreate productTagIds to send as responseBody
        productTagIdArr,                                                      // using productTagIdArr
        { transaction }                                                       // with transaction
      );
    }

    transaction.commit();                                                 // commit transaction
    res.status(200);                                                      // respond with 200 - OK
    res.json(responseBody);                                               // respond with response body (either a product or product tag IDs) as JSON
  } catch(err) {                                                        // catch errors
    transaction.rollback();                                               // rollback transaction
    res.status(500);                                                      // respond with 500 - Internal Server Error
    res.json(err);                                                        // respond with error as JSON
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;                                                // deconstruct URL params
  const body = req.body;                                                    // parse request body
  const tagIds = body.tagIds;                                               // get tagIds from request body
  const transaction = await sequelize.transaction();                        // create transaction to rollback if necessary

  try {                                                                     // try to
    const updated = await Product.update(body, {                              // update products
      transaction,                                                              // with transaction
      where: { id: id }                                                         // where id matches the URL param
    });

    if(updated === 0) {                                                       // if number of updated rows is 0
      transaction.rollback();                                                   // rollback transaction
      res.sendStatus(404);                                                      // respond with 404 - Not Found
      return;                                                                   // return
    }

    const productTags = await ProductTag.findAll({                            // find all associated productTags
      where: { product_id: id }                                                 // where product_id matches the URL param
    });

    const productTagIds = productTags.map(productTag => productTag.tag_id);   // map tag_ids from the productTags

    const newProductTags = tagIds                                             // get newProductTags by...
      .filter(tag_id => !productTagIds.includes(tag_id))                        // filtering out tag_ids that are already included in the productTagIds
      .map(tag_id => {                                                          // and map...
        return { product_id: id, tag_id };                                        // an object containing product_id = product.id + the tag_id itself
      });

    const productTagIdsToRemove = productTags                                 // get productTagsToRemove by...
      .filter(productTag => !tagIds.include(productTag.tag_id))                 // filtering out productTags that have tag_ids included in the tagIds of the request body
      .map(productTag => productTag.id);                                        // and map the value of productTag.id

    const updatedProductTags = await Promise.all([                            // promise all
      ProductTag.destroy({                                                      // destroy product tags
        transaction,                                                              // with transaction
        where: { id: productTagIdsToRemove }                                      // where ids are included in productTagIdsToRemove
      }),
      ProductTag.bulkCreate(newProductTags, { transaction })                    // bulk create new product tags with transaction
    ]);

    await transaction.commit();                                               // commit the transaction
    res.status(200);                                                          // respond with 200 - OK
    res.json(updatedProductTags);                                             // respond with the updatedProductTags as JSON
  } catch(err) {                                                            // catch errors
    await transaction.rollback();                                             // rollback transaction
    res.status(500);                                                          // respond with 500 - Internal Server Error
    res.json(err);                                                            // respond with error as JSON
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const destroyed = await Product.destroy({
      where: {
        id: id
      }
    });
    res.status(200);
    res.json(destroyed);
  } catch(err) {
    res.status(500);
    res.json(err);
  }
});

module.exports = router;
