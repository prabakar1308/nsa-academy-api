require("dotenv").config();

exports.updatePlayersInAlgolia = (players, algoliaIndex) => {
  // hello_algolia.js
  const algoliasearch = require("algoliasearch");

  // Connect and authenticate with your Algolia app
  const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY
  );
  // Create a new index and add a record
  const index = client.initIndex(
    algoliaIndex ? algoliaIndex : process.env.ALGOLIA_INDEX
  );
  index.saveObjects(
    players.map((player) => ({
      ...player,
      created: Date.parse(new Date()) / 1000,
    })),
    { autoGenerateObjectIDIfNotExist: true }
  );
};
