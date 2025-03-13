const express = require("express");
const { redeemReward } = require("../controllers/rewardController");
const router = express.Router();

router.post("/make-a-reward", redeemReward);

module.exports = router;
