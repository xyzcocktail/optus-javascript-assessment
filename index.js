
const exampleInputAssetList = [
  {
    id: "100001",
    title: "asset 1",
    description: "this is asset 1",
    broadcastStartTime: "2020-02-16T02:48:28Z",
    duration: 1000, // in seconds
    image: "https://image.domain1.com/cms/assets/100001.jpg",
    match: {
      id: "matchId200001",
      homeTeam: {
        id: "teamId00001",
        name: "team 000001",
        image: "https://image.domain1.com/cms/teams/100001.jpg",
        /* ..optional fields */
        address: "team 00001 address"
      },
      awayTeam: {
        id: "teamId00002",
        name: "team 000002",
        image: "https://image.domain1.com/cms/teams/100002.jpg"
      }
    },
    /* ..other fields */
    tags: ["tag1", "tag2"],
    updateAt: "2019-02-16T02:48:28Z",
    type: "minimatch"
  },
  {
    id: "100002",
    title: "asset 2",
    description: "this is asset 2",
    image: "https://image.domain1.com/cms/assets/100002.jpg",
    broadcastStartTime: "2018-02-16T02:48:28Z",
    duration: 60000,
    /* ..other fields */
    tags: ["tag1", "tag2"],
    updateAt: "2019-02-16T02:48:28Z",
    type: "minimatch"
  },
  {
    id: "100003",
    /* missing title and description */
    image: "https://image.domain1.com/cms/assets/100003.jpg",
    broadcastStartTime: "2018-02-16T02:48:28Z",
    duration: 60000,
    /* ..other fields */
    tags: ["tag1", "tag2"],
    updateAt: "2019-02-16T02:48:28Z",
    type: "minimatch"
  },
  {
    id: "100004",
    title: "asset 4",
    description: "this is asset 4",
    broadcastStartTime: "2022-02-16T02:48:28Z",
    duration: 81000,
    image: "https://image.domain1.com/cms/assets/100004.jpg",
    match: {
      homeTeam: {
        id: "teamId00006",
        /* missing team name */
        image: "https://image.domain1.com/cms/teams/100006.jpg"
        /* ..other fields */
      },
      awayTeam: {
        id: "teamId00009",
        name: "team 000009",
        image: "https://image.domain1.com/cms/teams/100009.jpg"
        /* ..other fields */
      }
    },
    /* ..other fields */
    tags: ["tag1", "tag2"],
    updateAt: "2019-02-16T02:48:28Z",
    type: "minimatch"
  }
  /* ... more assets */
];
console.log(exampleInputAssetList);

/*
 * An asset has to have the following mandatory fields
 */
const mandatoryFields = [
  "id",
  "title",
  "description",
  "broadcastStartTime",
  "duration",
  "image"
];

/*
 * Asset doesn't have to have an match object, but if an asset has a match object,
 * the match object has to have the following mandatory fields:
 * match.id,
 * match.homeTeam.id, match.homeTeam.name, match.homeTeam.image,
 * match.awayTeam.id, match.awayTeam.name, match.awayTeam.image,
 */
const optionalFields = {
  match: {
    id: [],
    homeTeam: ["id", "name", "image"],
    awayTeam: ["id", "name", "image"],
  }
};

/*
 * Requirement:
 * Create an software component in JavaScript which will take the exampleInputAssetList as input and output a new list which will:
 */
let resultOutput = [];

/* 1. filter out any asset or match that missing mandatory fields.
 * 2. output asset list should not include any optional fields; NOTE: if an asset has match object,
 *    the output asset list should include the match object unless the match object is missing any mandatory field
 */
const mandatoryFilters = (item, mandatory, options) => {
  return Object.fromEntries(
    Object.entries(item).filter(([key, value]) => {
      let isValidOpt = false;
      if (Object.keys(options).includes(key)) {
        isValidOpt = Object.keys(options[key]).every(mkey => { return Object.keys(value).includes(mkey); });
        if (isValidOpt) {
          Object.keys(options[key]).map(mkey => {
            if (options[key][mkey] && options[key][mkey].length > 0) {
              value[mkey] = mandatoryFilters(value[mkey], options[key][mkey], []);
            }
          });
        }
      }
      return mandatory.includes(key) || (isValidOpt && Object.keys(options).includes(key));
    })
  );
};

const createBroadcastEndTime = (asset) => {
  /* 3. create broadcastEndTime for each of the asset. It's value should be broadcastStartTime + duration in ISO8601 format
      (same format as broadcastStartTime) */
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
  if (asset && asset.broadcastStartTime && asset.duration) {
    let startTime = new Date(asset.broadcastStartTime);
    startTime.setTime(startTime.getTime() + (asset.duration * 1000));
    asset.broadcastEndTime = startTime.toISOString();
  }
  return asset;
};

const updateImageURL = (asset) => {
  /* 4. replace image.domain1.com/cms to cms.domain2.com for all image url */
  const pattern = /image.domain1.com\/cms/g;
  const replaceWith = 'cms.domain2.com';
  asset = JSON.parse(JSON.stringify(asset).replace(pattern, replaceWith));
  return asset;
};

resultOutput = exampleInputAssetList
  .filter((asset) => { return mandatoryFields.every((mkey) => { return Object.keys(asset).includes(mkey); }); })
  .map((asset) => { return mandatoryFilters(asset, mandatoryFields, optionalFields) })
  .map((asset) => { return createBroadcastEndTime(asset) })
  .map((asset) => { return updateImageURL(asset) })
  /* 5. sort the output asset list by broadcastStartTime */
  .sort((a, b) => { return new Date(b.broadcastStartTime) - new Date(a.broadcastStartTime); });

console.info( resultOutput );

document.getElementById("app").innerHTML = `<pre id="json"></pre>`;
document.getElementById("json").textContent = JSON.stringify(resultOutput, undefined, 2);


