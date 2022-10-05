const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

const missingTagNameError = () => ({ error: 'request body missing non-null "tag_name" property' });

router.get('/', async (_, res) => {
  try {                               // try to
    const tags = await Tag.findAll({    // find all tags
      include: [Product]                  // include associated products
    });

    res.status(200);                    // respond with 200 - OK
    res.json(tags);                     // respond with tags as JSON
  } catch(err) {                      // catch errors
    res.status(500);                    // respond with 500 - Internal Server Error
    res.json(err);                      // respond with error as JSON
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findByPk(id, {
      includes: [Product]
    });

    if(!tag) {
      res.sendStatus(404);
      return;
    }

    res.status(200);
    res.json(tag);
  } catch(err) {
    res.status(500);
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  const body = req.body;

  if(!body.tag_name) {
    res.status(400);
    res.json(missingTagNameError());
    return;
  }

  try {
    const tag = await Tag.create(body, {
      tag_name: body.tag_name
    });

    res.status(201);
    res.json(tag);
  } catch(err) {
    res.status(500);
    res.json(err);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;          // deconstruct URL params
  const body = req.body;              // parse request body
  if(!body.tag_name) {                // if the request body doesn't have a valid tag_name value
    res.status(400);                    // respond with 400 - Bad Request
    res.json(missingTagNameError());    // respond with error JSON
    return;                             // return
  }

  try {                               // try to
    const updated = await Tag.update(   // update tag
      { tag_name: body.tag_name },        // set tag_name to tag_name in request body
      { where: { id: id } }               // where id matches id URL parameter
    );

    if(updated > 0) {                         // if the number of tags updated is greater than 0
      res.status(200);                          // respond with 200 - OK
    } else {                                  // else
      res.status(404);                          // respond with 404 - Not Found
    }

    res.json(updated);                        // respond with an array containing 1 or 0 describing if a value was or was not updated
  } catch(err) {                            // catch errors
    res.status(500);                          // respond with 500 - Internal Server Error
    res.json(err);                            // respond with error as JSON
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;                // deconstruct URL params
  try {
    const destroyed = await Tag.destroy({   // destroy tag
      where: { id: id }                       // where id equals the id request parameter
    });

    res.status(200);                        // respond with 200 - OK
    res.json(destroyed);                    // respond with number of destroyed rows
  } catch(err) {                          // catch errors
    res.status(500);                        // respond with 500 - Internal Server Error
    res.json(err);                          // respond with error as JSON
  }
});

module.exports = router;
