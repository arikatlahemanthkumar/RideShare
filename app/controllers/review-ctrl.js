import Review from "../models/review-model.js";
import { validationResult } from "express-validator";
import _ from "lodash";

const reviewCtrl = {};


reviewCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = _.pick(req.body, ["tripId", "ratings", "comments"]);

  try {
    const review = new Review(body);
    review.carOwnerId= req.currentUser.userId
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};


reviewCtrl.list = async (req, res) => {
  try {
    const reviews = await Review.find()
    .populate("carOwnerId", "name")
    .populate("tripId");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};


reviewCtrl.getById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const review = await Review.findById(id)
    .populate("carOwnerId", "name")
    .populate("tripId");
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

reviewCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const body = _.pick(req.body, ["ratings", "comments"]);

  try {
    const review = await Review.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate("carOwnerId", "name")
    .populate("tripId");
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

reviewCtrl.delete = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

export default reviewCtrl;
