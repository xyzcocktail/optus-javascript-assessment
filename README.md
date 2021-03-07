```javascript
/*
 * You are receiving a list of show/asset metadata coming from our CMS system.
 * The data structure is expected as the exampleInputAssetList below.
 *
 * An asset has to have the following mandatory fields:
 * asset.id, asset.title, asset.description, asset.broadcastStartTime asset.duration, asset.image
 *
 * Asset doesn't have to have an match object, but if an asset has a match object,
 * the match object has to have the following mandatory fields:
 * match.id,
 * match.homeTeam.id, match.homeTeam.name, match.homeTeam.image,
 * match.awayTeam.id, match.awayTeam.name, match.awayTeam.image,
 *
 *
 * Requirement:
 * Create an software component in JavaScript which will take the exampleInputAssetList as input and output a new list which will:
 * 1. filter out any asset or match that missing mandatory fields.
 * 2. output asset list should not include any optional fields; NOTE: if an asset has match object,
 *    the output asset list should include the match object unless the match object is missing any mandatory field
 * 3. create broadcastEndTime for each of the asset. It's value should be broadcastStartTime + duration in ISO8601 format
 *    (same format as broadcastStartTime)
 * 4. replace image.domain1.com/cms to cms.domain2.com for all image url
 * 5. sort the output asset list by broadcastStartTime
 */

exampleInputAssetList = [
  {
    id: '100001',
    title: 'asset 1',
    description: 'this is asset 1',
    broadcastStartTime: '2020-02-16T02:48:28Z',
    duration: 1000,  // in seconds
    image: 'https://image.domain1.com/cms/assets/100001.jpg',
    match: {
      id: 'matchId200001',
      homeTeam: {
        id: 'teamId00001',
        name: 'team 000001',
        image: 'https://image.domain1.com/cms/teams/100001.jpg',
        /* ..optional fields */
        address: "team 00001 address"
      },
      awayTeam: {
        id: 'teamId00002',
        name: 'team 000002',
        image: 'https://image.domain1.com/cms/teams/100002.jpg'
      }
    },
    /* ..other fields */
    tags: ['tag1', 'tag2'],
    updateAt: '2019-02-16T02:48:28Z',
    type: 'minimatch'
  },
  {
    id: '100002',
    title: 'asset 2',
    description: 'this is asset 2',
    image: 'https://image.domain1.com/cms/assets/100002.jpg',
    broadcastStartTime: '2018-02-16T02:48:28Z',
    duration: 60000,
    /* ..other fields */
    tags: ['tag1', 'tag2'],
    updateAt: '2019-02-16T02:48:28Z',
    type: 'minimatch'
  },
  {
    id: '100003',
    /* missing title and description */
    image: 'https://image.domain1.com/cms/assets/100003.jpg',
    broadcastStartTime: '2018-02-16T02:48:28Z',
    duration: 60000,
    /* ..other fields */
    tags: ['tag1', 'tag2'],
    updateAt: '2019-02-16T02:48:28Z',
    type: 'minimatch'
  },
  {
    id: '100004',
    title: 'asset 4',
    description: 'this is asset 4',
    broadcastStartTime: '2022-02-16T02:48:28Z',
    duration: 81000,
    image: 'https://image.domain1.com/cms/assets/100004.jpg',
    match: {
      homeTeam: {
        id: 'teamId00006',
        /* missing team name */
        image: 'https://image.domain1.com/cms/teams/100006.jpg'
        /* ..other fields */
      },
      awayTeam: {
        id: 'teamId00009',
        name: 'team 000009',
        image: 'https://image.domain1.com/cms/teams/100009.jpg'
        /* ..other fields */
      }
    },
    /* ..other fields */
    tags: ['tag1', 'tag2'],
    updateAt: '2019-02-16T02:48:28Z',
    type: 'minimatch'
  }
  /* ... more assets */
];

exampleOutputAssetList = [
  {
    id: '100002',
    title: 'asset 2',
    description: 'this is asset 2',
    image: 'https://cms.domain2.com/assets/100002.jpg',
    broadcastStartTime: '2018-02-16T02:48:28Z',
    duration: 60000,
    broadcastEndTime: '2018-02-16T07:28:28Z', /* broadcastStartTime + 1000 seconds */
  },
  {
    id: '100001',
    title: 'asset 1',
    description: 'this is asset 1',
    broadcastStartTime: '2020-02-16T02:48:28Z',
    duration: 1000,  // in seconds
    broadcastEndTime: '2020-02-16T03:05:08Z', /* broadcastStartTime + 1000 seconds */
    image: 'https://cms.domain2.com/assets/100001.jpg',
    match: {
      id: 'matchId200001',
      homeTeam: {
        id: 'teamId00001',
        name: 'team 000001',
        image: 'https://cms.domain2.com/teams/100001.jpg'
        /* optional fields (address) got removed */
      },
      awayTeam: {
        id: 'teamId00002',
        name: 'team 000002',
        image: 'https://cms.domain2.com/teams/100002.jpg'
      }
    }

    /* optional fields get removed */
  },
  /* asset id 100003 got remove because it is missing title and description */
  {
    id: '100004',
    title: 'asset 4',
    description: 'this is asset 4',
    image: 'https://cms.domain2.com/assets/100004.jpg',
    broadcastStartTime: '2022-02-16T02:48:28Z',
    duration: 81000
    broadcastEndTime: '2022-02-17T01:18:28Z', /* broadcastStartTime + 1000 seconds */
    /* match object get remove because it is missing homeTeam.name  */
  }
  /* ... more assets */
];
```
