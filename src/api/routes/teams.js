const express = require('express');
const model = require('../helpers');

// need to create a router for http requests
const router = express.Router();

router.get('/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const tables = await model.getAll(tableName);
    res.status(200).json(tables);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  try {
    const table = await model.getOne(tableName, id);
    res.status(200).json(table);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const { tableData } = req.body;
  try {
    const newTable = await model.add(tableName, tableData);
    res.status(200).json(newTable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:tableName/:id', async (req, res) => {
  const { tableName } = req.params;
  const { tableData, id } = req.body;
  try {
    const table = await model.update(tableName, id, tableData);
    res.status(200).json(table);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  try {
    const newTable = await model.destroy(tableName, id);
    res.status(200).json(newTable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Example: /api/paginate/my-table?orderByColumn=id&orderByDirection=asc&searchColumn=team_name&searchValue=falcons&resultsPerPage=15
router.get('/paginate/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const {
    orderByColumn,
    orderByDirection,
    searchColumn,
    searchValue,
    page,
    resultsPerPage,
  } = req.query;
  try {
    const paginatedTables = await model.paginate(
      tableName,
      orderByColumn,
      orderByDirection,
      searchColumn,
      searchValue,
      page,
      resultsPerPage
    );
    res.status(200).json(paginatedTables);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
