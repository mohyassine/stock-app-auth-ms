// const { assert } = require('chai');

// const { find, insert, removeById } = require('../../lib/db/common_db');
// const db = require('../../lib/db');

// describe('Testing DB functions for user table...', () => {
//   let collection;

//   const testUser = {
//     firstName: 'test',
//     lastName: 'user',
//   };

//   before(async () => {
//     await db.connect();
//     collection = db.collection('test');

//     await insert(collection, testUser);
//   });

//   after(async () => {
//     await removeById(collection, testUser._id);
//   });

//   it('find user with first name test', async () => {
//     const results = await find(collection, { firstName: 'test' });
//     assert.isNotEmpty(results, 'User should exist');

//     const actualUser = results[0];

//     assert.deepInclude(actualUser, testUser);
//   });
// });
