const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const { SampleEntity } = require("../../common/model");
const logger = require("../../common/logger");

module.exports = () => {
  const router = express.Router();

  /**
   * Get all items
   * */
  router.get(
    "/items",
    tryCatch(async (req, res) => {
      const allData = await SampleEntity.find({});
      return res.json(allData);
    })
  );

  /**
   * Get item by id
   */
  router.get(
    "/items/:id",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      const retrievedData = await SampleEntity.findOne({ id: itemId });
      if (retrievedData) {
        res.json(retrievedData);
      } else {
        res.json({ message: `Item ${itemId} doesn't exist` });
      }
    })
  );

  /**
   * Add an item
   */
  router.post(
    "/items",
    tryCatch(async (req, res) => {
      const item = req.body;
      logger.info("Adding new item: ", item);

      const sampleToAdd = new SampleEntity({
        id: req.body.id,
        nom: req.body.nom,
        valeur: req.body.valeur,
      });

      await sampleToAdd.save();

      // return updated list
      res.json(sampleToAdd);
    })
  );

  /**
   * Update an item
   */
  router.put(
    "/items",
    tryCatch(async (req, res) => {
      const item = req.body;
      logger.info("Updating new item: ", item);
      await SampleEntity.findOneAndUpdate({ id: req.body.id }, item, { new: true });
      res.json(req.body);
    })
  );

  /**
   * Update an item
   */
  router.delete(
    "/items/:id",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      await SampleEntity.deleteOne({ id: itemId });
      res.json({ message: `Item ${itemId} deleted !` });
    })
  );

  return router;
};
