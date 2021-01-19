exports.seed = function (knex) {
  // Deletes ALL existing entries 💀
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries 🌱
      return knex('users').insert([
        {
          id: 1,
          team_name: 'Team1',
          location: 'Europe',
          date: new Date(),
        },
        {
          id: 2,
          team_name: 'Team2',
          location: 'Spain',
          date: new Date(),
        },
      ]);
    });
};
