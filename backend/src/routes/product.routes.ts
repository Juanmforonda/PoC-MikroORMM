import {Router} from 'express'
import {findAll, findOne, add, update, remove, findByCategory, findOutOfStock} from '../controllers/product.controller.js'
const productRouter = Router()



productRouter.get('/', findAll);
productRouter.get('/:id', findOne);
productRouter.post('/', add);
productRouter.put('/:id', update);
productRouter.delete('/:id', remove);
productRouter.get('/category/:categoryId', findByCategory);
productRouter.get('/out-of-stock', findOutOfStock);

export default productRouter;
