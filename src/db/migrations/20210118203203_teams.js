exports.up = function (knex) {
  return knex.schema.createTable('teams', (tbl) => {
    tbl.increments();
    tbl.text('team_name').notNullable();
    tbl.text('location').notNullable();
    tbl.datetime('date').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('teams');
};
