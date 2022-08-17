import { Router } from "../../deps.ts";
import {
  findAll,
  findProd,
  createProd,

} from "../handlers/users.handler.ts";

export const router = new Router()
  .get("/api/prods", findAll)
  .get("/api/prods/:prodId", findProd)
  .post("/api/prods", createProd)
