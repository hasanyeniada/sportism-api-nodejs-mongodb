const fs = require('fs');

const sportCentersData = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/simple-sport-centers.json`,
    'utf-8'
  )
);

const checkId = (req, resp, next, val) => {
  console.log(`Requested Tour id is => ${val}`);
  const id = Number.parseInt(req.params.id);
  const sportCenter = sportCentersData.find((el) => el.id === id);

  if (!sportCenter) {
    return resp.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  next();
};

const checkBody = (req, resp, next) => {
  const requestBody = req && req.body;
  console.log(requestBody);
  if (!requestBody || !requestBody.name || !requestBody['monthly-price']) {
    return resp.status(400).json({
      status: 'fail',
      message:
        'Bad request, cannot be created sport center without name and price!',
    });
  }
  next();
};

const getAllSportCenters = (req, resp) => {
  resp.status(200).json({
    status: 'success',
    results: sportCentersData.length,
    data: sportCentersData,
  });
};

const getSingleSportCenterWithId = (req, resp) => {
  const id = Number.parseInt(req.params.id);

  const sportCenter = sportCentersData.find((el) => el.id === id);
  resp.status(200).json({
    status: 'success',
    data: sportCenter,
  });
};

const createSportCenter = (req, resp) => {
  const newId = Date.now();
  const newSportCenter = Object.assign({ id: newId }, req.body);

  sportCentersData.push(newSportCenter);

  fs.writeFile(
    `${__dirname}/dev-data/data/simple-sport-centers.json`,
    JSON.stringify(sportCentersData),
    (err) => {
      console.log(err)
    }
  );

  resp.status(201).json({
    status: 'success',
    data: newSportCenter,
  });
};

const updateSportCenterWithId = (req, resp) => {
  // const id = Number.parseInt(req.params.id);
  // const sportCenter = sportCentersData.find((el) => el.id === id);
  resp.status(200).json({
    status: 'success',
    data: { sportCenter: 'Updated Sport Center Here!' },
  });
};

const deleteSportCenterWithId = (req, resp) => {
  const id = Number.parseInt(req.params.id);
  const sportCenter = sportCentersData.find((el) => el.id === id);

  const sportCentersDataTemp = sportCentersData.filter(
    (el) => el.id !== sportCenter.id
  );

  fs.writeFile(
    `${__dirname}/../dev-data/data/simple-sport-centers.json`,
    JSON.stringify(sportCentersDataTemp),
    (err) => { console.log(err) }
  );

  resp.status(200).json({
    status: 'success',
    data: sportCenter,
  });
};

module.exports = {
  getAllSportCenters,
  getSingleSportCenterWithId,
  createSportCenter,
  deleteSportCenterWithId,
  updateSportCenterWithId,
  checkId,
  checkBody
};
