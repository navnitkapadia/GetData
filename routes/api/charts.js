const express = require("express");
const router = express.Router();
const Charts = require("../../models/Chart");
// @route Get api/Chart
// @desc Register user
// @access Public
router.get("/all", (req, res) => {  
  var sensorId = req.query.sensorId;
  var start  = req.query.start;
  var end = req.query.end;
    Charts.find({ 'sensorId': sensorId,
    "date": {"$gte": new Date(start), "$lt": new Date(end)}
  }).then(users => {res.json(users)}).catch((err)=> {
    console.log('ERROR', err);
  });
})

module.exports = router;
