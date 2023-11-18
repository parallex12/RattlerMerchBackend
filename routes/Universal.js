import express from "express";
import { addReviewToProduct, createDoc, createDocByNewId, deleteData, deleteDataByCustomId, getAllDocs, getAllDocsByCategory, getAllTable, getDocById, getDocWithCustomId, updateDocByCustomId, updateDocById } from "../controller/index.js";
import { ensureToken } from "../services/Secure.js";

const router = express.Router();

//create data
router.post("/", ensureToken, createDoc);

//create data by new id
router.post("/create", ensureToken, createDocByNewId);

//get data
router.get("/", ensureToken, getDocById);

//get all docs
router.get("/all", ensureToken, getAllDocs);

//get complete table
router.get("/every", ensureToken, getAllTable);

//get all docs by category
router.get("/category/:category", ensureToken, getAllDocsByCategory);

//get data by id
router.get("/:id", ensureToken, getDocWithCustomId);

//update data
router.put("/", ensureToken, updateDocById);

//update by custom id
router.put("/:id", ensureToken, updateDocByCustomId);


//add review to product
router.put("/review/:id", ensureToken, addReviewToProduct);

//delete data
router.delete("/", ensureToken, deleteData);

//delete by custom id
router.delete("/:id", ensureToken, deleteDataByCustomId);

export default router;
