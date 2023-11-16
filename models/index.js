import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import firebase from "../services/Firebase.js";
import { SortTableData } from "../services/index.js";

let app = firebase?.app;
let db = firebase?.db;
let storage = firebase?.storage;

export const Query = {
  query_Get_by_id: async (path, id) => await getDoc(doc(db, path, id)),
  query_Get_by_phone: async (phone) => {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phone)));
    return SortTableData(querySnapshot)
  },
  query_Get_by_sellerId: async (path,id) => {
    const querySnapshot = await getDocs(query(collection(db, path), where("created_by_id", "==", id)));
    return SortTableData(querySnapshot)
  },
  query_Get_by_category: async (path,category) => {
    const querySnapshot = await getDocs(query(collection(db, path), where("category", "==", category)));
    return SortTableData(querySnapshot)
  },
  query_update_by_id: async (path, id, data) =>
    await setDoc(doc(db, path, id), data, { merge: true }),
  query_create: async (path, id, data) =>
    await setDoc(doc(db, path, id), data),
  query_delete: async (path, id) => await deleteDoc(doc(db, path, id)),
};
