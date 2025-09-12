import { Request, Response } from 'express';
import { initORM } from '../db.js';
import { Category } from '../modules/category.entity.js';

const db = await initORM();


async function findAll(req: Request, res: Response) {
  try {
    const categories = await db.em.find(Category, {});
    res
      .status(200)
      .json({ message: 'found all categories', data: categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoryFound = await db.em.findOneOrFail(Category, {
      id,
    });
    res
      .status(200)
      .json({ message: 'found category', data: categoryFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    //Chequeo si ya existe una categoria con ese nombre
    const categoryExists = await db.em.findOne(Category, {
      name: req.body.name,
    });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const newCategory = db.em.create(Category, req.body);
    await db.em.flush();
    res
      .status(201)
      .json({ message: 'Category created', data: newCategory });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    const categoryToUpdate = db.em.getReference(Category, id);

    db.em.assign(categoryToUpdate, req.body);

    await db.em.flush();

    res.status(200).json({ message: 'Category updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    //Chequeo si la categoria existe
    const id = Number.parseInt(req.params.id);
    const categoryToRemove = await db.em.findOne(Category, { id });

    if (!categoryToRemove) {
      return res.status(404).json({ message: 'Category not found' });
    }

    //Chequeo si tiene productos asociados, si los tiene, setear a null la categoria de esos productos

    const categoryWithProducts = await db.em.findOne(Category, { id }, { populate: ['products'] });

    if (categoryWithProducts && categoryWithProducts.products.length > 0) {
      for (const product of categoryWithProducts.products) {
        product.category = null;
      }
    }

    await db.em.removeAndFlush(categoryToRemove);
    res.status(200).json({ message: 'Category removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
