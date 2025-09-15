import { Router } from "express";
import { findAll, remove, findOne, add, update } from "../controllers/tag.controller.js";
const tagRouter = Router();
tagRouter.get('/', findAll);
tagRouter.get('/:id', findOne);
tagRouter.post('/', add);
tagRouter.put('/:id', update);
tagRouter.delete('/:id', remove);
export default tagRouter;
