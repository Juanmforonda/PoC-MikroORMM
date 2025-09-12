import {Router} from 'express'
import { findAll, findOne, update, remove, add } from '../controllers/category.controller.js'
const categoryRouter = Router()

categoryRouter.get('/', findAll)
categoryRouter.get('/:id', findOne)
categoryRouter.put('/:id', update)
categoryRouter.delete('/:id', remove)
categoryRouter.post('/', add)

export default categoryRouter
