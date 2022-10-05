const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

const missingCategoryNameError = () => ({ error: 'request body missing non-null "category_name" property' });

router.get('/', async (_, res) => {
  const categories = await Category.findAll({   // find all categories
    include: [Product]                            // include associated products
  });

  res.status(200);                              // respond with 200 - OK
  res.json(categories); // respond with found categories as JSON
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;                      // deconstruct URL params
  const category = await Category.findByPk(id, {  // find category by ID
    include: [Product]                            // include associated products
  });

  if(!category) {                                 // if not found
    res.sendStatus(404);                            // respond with 404 - Not Found
    return;                                         // return
  }

  res.status(200);                                // respond with 200 - OK
  res.json(category);                             // respond with found category as JSON
});

router.post('/', async (req, res) => {
  const body = req.body;                          // parse request body
  if(!body.category_name) {                       // if the request body doesn't have a valid category_name value
    res.status(400);                                // respond with 400 - Bad Request
    res.json(missingCategoryNameError());           // respond with error JSON
    return;                                         // return
  }

  const category = await Category.create({        // create category
    category_name: body.category_name.toString()    // with category_name as the value of category_name in the request body
  });

  res.status(201);                                // respond with 200 - OK
  res.json(category);                             // respond with created category as JSON
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;              // deconstruct URL params
  const body = req.body;                  // parse request body
  if(!body.category_name) {               // if the request body doesn't have a valid category_name value
    res.status(400);                        // respond with 400 - Bad Request
    res.json(missingCategoryNameError());   // respond with error JSON
    return;                                 // return
  }

  const updated = await Category.update(  // update category
    { category_name: body.category_name },  // set category_name to the value of category_name in the request body
    { where: { id: id } }                   // where id equals the id request parameter
  );

  if(updated > 0) {                       // if the number of categories updated is greater than 0
    res.status(200);                        // respond with 200 - OK
  } else {                                // else
    res.status(404);                        // respond with 404 - Not Found
  }

  res.json(updated);                      // respond with an array containing 1 or 0 describing if a value was or was not updated
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;                  // deconstruct URL params
  const destroyed = await Category.destroy({  // destroy category
    where: { id: id }                           // where id equals the id request parameter
  });

  res.status(200);                            // respond with 200 - OK
  res.json(destroyed);                        // respond with number of destroyed rows
});

module.exports = router;
