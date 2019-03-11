const express = require("express");
const router = express.Router();
const Charts = require("../../models/Chart");
// @route Get api/Chart
// @desc Register user
// @access Public
router.get("/all", (req, res) => {
  var sensorId = req.query.sensorId;
  var start = req.query.start;
  var end = req.query.end;
  var topic = req.query.topic;
  Charts.find({
    'sensorId': sensorId,
    'topic': topic,
    "date": { "$gte": new Date(start), "$lt": new Date(end) }
  }).then(users => {
    var map = users.map((value) => {
      return {
        value: value.value,
        date: value.date
      }
    })
    return res.json(map);
  }).catch((err) => {
    console.log('ERROR', err);
  });
})

module.exports = router;
