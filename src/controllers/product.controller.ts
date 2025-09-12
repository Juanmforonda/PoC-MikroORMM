import { Request, Response } from 'express';
import { initORM } from '../db.js';
import { Product } from '../modules/product.entity.js';
import { Category } from '../modules/category.entity.js';

const db = await initORM();

async function findAll(req: Request, res: Response) {
  try {
    const products = await db.em.find(
      Product,
      {},
      { populate: ['category', 'tags'] }
    );
    res.status(200).json({ message: 'found all products', data: products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const productFound = await db.em.findOneOrFail(
      Product,
      {
        id,
      },
      { populate: ['category', 'tags', 'orders'] }
    );
    res.status(200).json({ message: 'found product', data: productFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    // Chequeo si ya existe un producto con ese nombre
    const productExists = await db.em.findOne(Product, {
      name: req.body.name,
    });

    if (productExists) {
      return res.status(400).json({ message: 'Product already exists' });
    }

    // Validaciones específicas para producto
    if (req.body.price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (req.body.stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Si se proporciona categoryId, verificar que existe
    if (req.body.categoryId) {
      const categoryExists = await db.em.findOne(Category, {
        id: req.body.categoryId,
      });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
      req.body.category = categoryExists;
      delete req.body.categoryId;
    }

    const newProduct = db.em.create(Product, req.body);
    await db.em.flush();
    res.status(201).json({ message: 'Product created', data: newProduct });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    const productToUpdate = await db.em.findOne(Product, { id });

    if (!productToUpdate) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validaciones específicas para actualización
    if (req.body.price !== undefined && req.body.price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (req.body.stock !== undefined && req.body.stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Si se actualiza la categoría
    if (req.body.categoryId) {
      const categoryExists = await db.em.findOne(Category, {
        id: req.body.categoryId,
      });
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
      req.body.category = categoryExists;
      delete req.body.categoryId;
    }

    db.em.assign(productToUpdate, req.body);
    await db.em.flush();

    res.status(200).json({ message: 'Product updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const productToRemove = await db.em.findOne(Product, { id });

    if (!productToRemove) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Chequeo si tiene órdenes asociadas
    const productWithOrders = await db.em.findOne(
      Product,
      { id },
      { populate: ['orders'] }
    );

    if (productWithOrders && productWithOrders.orders.length > 0) {
      return res.status(400).json({
        message:
          'Cannot delete product with existing orders. Cancel orders first.',
      });
    }

    await db.em.removeAndFlush(productToRemove);
    res.status(200).json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
