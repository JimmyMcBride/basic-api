const db = require('../../db/config');

exports.getAll = async (tableName) => {
  return await db(tableName);
};

exports.getOne = async (tableName, id) => {
  return await db(tableName).where({ id }).first();
};

exports.update = async (tableName, id, tableData) => {
  const results = await db(tableName)
    .update(tableData)
    .where({ id })
    .returning('*');
  return results[0];
};

exports.add = async (tableName, tableData) => {
  const results = await db(tableName).insert(tableData).returning('*');
  return results[0];
};

exports.destroy = async (tableName, id) => {
  const table = await db(tableName).where({ id }).del();

  if (!table) return false;

  return true;
};

exports.paginate = async (
  tableName,
  orderByColumn,
  orderByDirection,
  searchColumn,
  searchValue,
  page,
  resultsPerPage
) => {
  try {
    if (isNaN(Number(resultsPerPage)) && resultsPerPage !== undefined)
      throw new Error(
        `Results per page expected a number, but got "${resultsPerPage}" instead.`
      );
    const numResults = !resultsPerPage ? 30 : Number(resultsPerPage);
    const currentPage = !page ? 1 : Number(page);
    const search = !searchValue ? '' : searchValue;
    const direction =
      !orderByDirection ||
      orderByDirection === 'asc' ||
      orderByDirection === 'ASC'
        ? 'asc'
        : 'desc';

    if (
      orderByDirection !== 'asc' &&
      orderByDirection !== 'ASC' &&
      orderByDirection !== 'desc' &&
      orderByDirection !== 'DESC' &&
      orderByDirection !== undefined &&
      orderByDirection !== null
    )
      throw new Error(
        "URL Query Error (orderByDirection): Please enter 'asc' or 'ASC' for ascending order (this is the default behavior if blank) or 'desc' or 'DESC' for descending order."
      );

    const countQuery = !searchColumn
      ? `select count(*) from ${tableName};`
      : `select count(*) from ${tableName} where ${
          Number(search)
            ? `${searchColumn}='${search}'`
            : `${searchColumn} like '%${search}%'`
        };`;

    const { rows: countRows } = await db.raw(countQuery);

    const count = Number(countRows[0].count);
    const totalPages = Math.ceil(count / numResults);

    const offset = (currentPage - 1) * numResults;

    const readQuery = `SELECT * FROM ${tableName}
        ${
          !searchColumn
            ? ''
            : `WHERE ${
                Number(search)
                  ? `${tableName}.${searchColumn}='${search}'`
                  : `${tableName}.${searchColumn} like '%${search}%'`
              }`
        }
        ORDER BY ${
          !orderByColumn
            ? `${
                !searchColumn
                  ? `${tableName}.${tableName.slice(0, -1)}_id`
                  : searchColumn
              }`
            : orderByColumn
        } ${direction}
        LIMIT ${numResults}
        OFFSET ${offset};`;

    const { rows } = await db.raw(readQuery);

    if (totalPages === 0)
      throw new Error(
        `The table you queried exists, but is empty. Please add some data so you can get results back.`
      );

    if (currentPage > totalPages)
      throw new Error(
        `You tried to grab page ${currentPage} but there are only ${totalPages} pages for this query.`
      );

    return {
      currentPage,
      totalPages,
      resultsPerPage: numResults,
      totalResults: count,
      resultsRange: `${offset + 1}-${
        offset + numResults > count ? count : offset + numResults
      }`,
      results: rows,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
