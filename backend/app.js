const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const sportCentersData = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/simple-sport-centers.json`,
    'utf-8'
  )
);

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

  if (!sportCenter) {
    return resp.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

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
      resp.status(500).json({
        status: 'error',
        desc: 'New sport center cannot be created!',
      });
    }
  );

  resp.status(201).json({
    status: 'success',
    data: newSportCenter,
  });
};

const updateSportCenterWithId = (req, resp) => {
  const id = Number.parseInt(req.params.id);
  const sportCenter = sportCentersData.find((el) => el.id === id);

  if (!sportCenter) {
    return resp.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  resp.status(200).json({
    status: 'success',
    data: { sportCenter: 'Updated Sport Center Here!' },
  });
};

const deleteSportCenterWithId = (req, resp) => {
  const id = Number.parseInt(req.params.id);
  const sportCenter = sportCentersData.find((el) => el.id === id);

  if (!sportCenter) {
    return resp.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  const sportCentersDataTemp = sportCentersData.filter(
    (el) => el.id !== sportCenter.id
  );

  fs.writeFile(
    `${__dirname}/dev-data/data/simple-sport-centers.json`,
    JSON.stringify(sportCentersDataTemp),
    (err) => {
      console.log(err);
      resp.status(500).json({
        status: 'error',
        desc: 'Sport center cannot be deleted!',
      });
    }
  );

  resp.status(200).json({
    status: 'success',
    data: sportCenter,
  });
};

app.get('/api/v1/sportcenters', getAllSportCenters);
app.get('/api/v1/sportcenters/:id', getSingleSportCenterWithId);
app.post('/api/v1/sportcenters', createSportCenter);
app.patch('/api/v1/sportcenters/:id', updateSportCenterWithId);
app.delete('/api/v1/sportcenters/:id', deleteSportCenterWithId);

app
  .route('/api/v1/sportcenters')
  .get(getAllSportCenters)
  .post(createSportCenter);
app
  .route('/api/v1/sportcenters/:id')
  .get(getSingleSportCenterWithId)
  .patch(updateSportCenterWithId)
  .delete(deleteSportCenterWithId);

const port = 8090;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});