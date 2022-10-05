const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (_, res) => {
  const products = await Product.findAll({    // find all products
    include: [Category, Tag]                    // include associated categories and tags
  });

  res.status(200);                            // respond with 200 - OK
  res.json(products);                         // respond with found products as JSON
});

// get one product
router.get('/:id', async (req, res) => {
  const { id } = req.params;                    // deconstruct URL params
  const product = await Product.findByPk(id, {  // find product by ID
    include: [Category, Tag]
  });

  if(!product) {                                // if not found 
    res.sendStatus(404);                          // respond with 404 - Not Found
    return;                                       // return
  }

  res.status(200);                              // respond with 200 - OK
  res.json(product);                            // respond with found product as JSON
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  const body = req.body;
  try {
    const product = await Product.create(body);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if(body.tagIds.length) {
      const productTagIdArr = body.tagIds.map(tag_id => {
        return { product_id: product.id, tag_id };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
    } else {
      // if no product tags, just respond
      res.status(200).json(product);
    }
  } catch(err) {
    res.status(400).json(err);
  }
  // Product.create(req.body)
  //   .then((product) => {
  //     // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  //     if (req.body.tagIds.length) {
  //       const productTagIdArr = req.body.tagIds.map((tag_id) => {
  //         return {
  //           product_id: product.id,
  //           tag_id,
  //         };
  //       });
  //       return ProductTag.bulkCreate(productTagIdArr);
  //     }
  //     // if no product tags, just respond
  //     res.status(200).json(product);
  //   })
  //   .then((productTagIds) => res.status(200).json(productTagIds))
  //   .catch((err) => {
  //     res.status(400).json(err);
  //   });
});

// update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    // update product data
    await Product.update(body, {
      where: { id: id }
    });
    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({
      where: { product_id: id }
    });
    // get list of current tag_ids
    const productTagIds = productTags
      .map(productTag => productTag.tag_id);
    // create filtered list of new tag_ids
    const newProductTags = body.tagIds
      .filter(tag_id => !productTagIds.includes(tag_id))
      .map(tag_id => {
        return { product_id: id, tag_id };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(productTag => !body.tagIds.include(productTag.tag_id))
      .map(productTag => productTag.id);
    // run both actions
    const updatedProductTags = Promise.all(
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    );
    res.status(200).json(updatedProductTags);
  } catch(err) {
    res.status(400).json(err);
  }
  // // update product data
  // Product.update(req.body, {
  //   where: {
  //     id: req.params.id,
  //   },
  // })
  //   .then((product) => {
  //     // find all associated tags from ProductTag
  //     return ProductTag.findAll({ where: { product_id: req.params.id } });
  //   })
  //   .then((productTags) => {
  //     // get list of current tag_ids
  //     const productTagIds = productTags.map(({ tag_id }) => tag_id);
  //     // create filtered list of new tag_ids
  //     const newProductTags = req.body.tagIds
  //       .filter((tag_id) => !productTagIds.includes(tag_id))
  //       .map((tag_id) => {
  //         return {
  //           product_id: req.params.id,
  //           tag_id,
  //         };
  //       });
  //     // figure out which ones to remove
  //     const productTagsToRemove = productTags
  //       .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
  //       .map(({ id }) => id);

  //     // run both actions
  //     return Promise.all([
  //       ProductTag.destroy({ where: { id: productTagsToRemove } }),
  //       ProductTag.bulkCreate(newProductTags),
  //     ]);
  //   })
  //   .then((updatedProductTags) => res.json(updatedProductTags))
  //   .catch((err) => {
  //     res.status(400).json(err);
  //   });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  const { id } = req.params;
  +
    0;
  res.sendStatus(501);
});

module.exports = router;
