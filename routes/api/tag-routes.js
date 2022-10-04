const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data

  res.sendStatus(501);
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data

  res.sendStatus(501);
});

router.post('/', (req, res) => {
  // create a new tag

  res.sendStatus(501);
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value

  res.sendStatus(501);
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value

  res.sendStatus(501);
});

module.exports = router;
