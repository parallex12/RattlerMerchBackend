import firebase from "../services/Firebase.js";
import { Query } from "../models/index.js";
import { PrivateKey, SortTableData, _tokenDetails } from "../services/index.js";
import jsonwebtoken from "jsonwebtoken";
import { doc, setDoc } from "firebase/firestore";
import crypto from "crypto"

export const getDocById = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      let _tempData = { ...queryData?.data(), id: id }
      res.send(_tempData);
    } else {
      console.log(id)
      res.send({ msg: "No data Found", code: "404" });
    }
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const getAllDocs = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    console.log("where",id)
    console.log("req.token",req.token)
    const queryData = await Query?.query_Get_by_created_Id(path[1], id);
    res.send(queryData)
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};


export const getAllBysellerId = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    const queryData = await Query?.query_Get_by_seller_Id(path[1], id);
    res.send(queryData)
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const getAllWhereUserById = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    const queryData = await Query?.query_Get_by_user_Id(path[1], id);
    res.send(queryData)
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};


export const getAllTable = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    console.log(path)
    const queryData = await Query?.query_Get_all(path[1]);
    res.send(queryData)
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const getAllDocsByCategory = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let category = req.params.category;
    const queryData = await Query?.query_Get_by_category(path[1], category);
    res.send(queryData)
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const getDocWithCustomId = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = req.params.id;
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      let d = queryData?.data()
      d["id"] = id
      res.send(d);
    } else {
      res.send({ msg: "No data Found", code: "404" });
    }
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const getAllInTable = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = req.params.id;
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      res.send(queryData?.data());
    } else {
      res.send({ msg: "No data Found", code: "404" });
    }
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};


export const createDoc = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    let data = req.body
    if (Object.keys(data)?.length == 0) {
      res.send({ msg: `Include `, code: "500" })
      res.end()
      return
    }
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      res.send({ msg: `${path[1]} already exists`, code: "500" });
    } else {
      const createdData = await Query.query_create(path[1], id, data)
      const queryData = await Query?.query_Get_by_id(path[1], id);
      res.send({
        msg: "Data Created.",
        code: 200,
        created_data: queryData?.data(),
      });
    }
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const createDocByNewId = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = crypto.randomBytes(20).toString('hex');
    let sellerId = _tokenDetails(req.token)?.user_id;
    let data = req.body
    if (Object.keys(data)?.length == 0) {
      res.send({ msg: `Include `, code: "500" })
      res.end()
      return
    }
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      res.send({ msg: `${path[1]} already exists`, code: "500" });
    } else {
      data["created_by_id"] = sellerId
      const createdData = await Query.query_create(path[1], id, data)
      const queryData2 = await Query?.query_Get_by_created_Id(path[1], sellerId);
      res.send({
        msg: "Data Created.",
        code: 200,
        created_data: queryData2,
      });
    }
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};


export const updateDocById = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    let data = req.body;
    if (
      Object.keys(data).length === 0 ||
      data?.email ||
      data?.provider ||
      data?.password
    ) {
      res.sendStatus(400);
      return;
    }

    const queryData = await Query?.query_update_by_id(path[1], id, data);
    const queryGetData = await Query?.query_Get_by_id(path[1], id);
    res.send({
      msg: "data updated.",
      code: 200,
      updated_data: queryGetData?.data(),
    });
    res.end();
  } catch (e) {
    console.log(e.message);
    res.send(500);
    res.end();
  }
};

export const addReviewToProduct = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = req.params.id;
    let data = req.body;
    if (
      Object.keys(data).length === 0 ||
      data?.email ||
      data?.provider ||
      data?.password
    ) {
      res.sendStatus(400);
      return;
    }

    const queryGetData = await Query?.query_Get_by_id(path[1], id);
    if (queryGetData?.exists()) {
      let reviews = queryGetData?.data()?.reviews
      reviews.push(data)
      const queryData = await Query?.query_update_by_id(path[1], id, { reviews: reviews });
      const queryGetUpdatedData = await Query?.query_Get_by_id(path[1], id);
      res.send({
        msg: "data updated.",
        code: 200,
        updated_data: queryGetUpdatedData?.data(),
      });
    }
    res.end();
  } catch (e) {
    console.log(e.message);
    res.send(500);
    res.end();
  }
};

export const updateDocByCustomId = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = req.params.id;
    let data = req.body;
    if (
      Object.keys(data).length === 0 ||
      data?.email ||
      data?.provider ||
      data?.password
    ) {
      res.sendStatus(400);
      return;
    }

    const queryData = await Query?.query_update_by_id(path[1], id, data);
    const queryGetData = await Query?.query_Get_by_id(path[1], id);
    const queryGetAllData = await Query?.query_Get_all(path[1]);
    res.send({
      msg: "data updated.",
      code: 200,
      updated_data: queryGetData?.data(),
      all_data: queryGetAllData
    });
    res.end();
  } catch (e) {
    console.log(e.message);
    res.send(500);
    res.end();
  }
};

export const deleteData = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = _tokenDetails(req.token)?.user_id;
    const queryData = await Query?.query_Get_by_id(path[1], id);
    console.log(queryData.data())
    if (queryData.exists()) {
      const deletQuery = await Query?.query_delete(path[1], id);
      res.send({ msg: "Deleted Successfully", code: 200 });
    } else {
      res.send({ msg: "No data Found", code: "404" });
    }
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};

export const deleteDataByCustomId = async (req, res) => {
  try {
    let path = req.originalUrl?.replace("/", "").split("/");
    let id = req.params.id;
    const queryData = await Query?.query_Get_by_id(path[1], id);
    if (queryData.exists()) {
      const deletQuery = await Query?.query_delete(path[1], id);
      res.send({ msg: "Deleted Successfully", code: 200 });
    } else {
      res.send({ msg: "No data Found", code: "404" });
    }
    res.end();
  } catch (e) {
    console.log("Firebase", e.message);
    res.sendStatus(500);
    res.end();
  }
};