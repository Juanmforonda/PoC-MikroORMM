import { Request, Response } from 'express';
import { initORM } from '../db.js';
import { Tag } from '../modules/tag.entity.js';

const db = await initORM();

async function findAll(req: Request, res: Response) {
  try {
    const tags = await db.em.find(Tag, {}, { populate: ['products'] });
    res.status(200).json({ message: 'found all tags', data: tags });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tagFound = await db.em.findOneOrFail(
      Tag,
      {
        id,
      },
      { populate: ['products'] }
    );
    res.status(200).json({ message: 'found tag', data: tagFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    // Chequeo si ya existe un tag con ese nombre
    const tagExists = await db.em.findOne(Tag, {
      name: req.body.name,
    });

    if (tagExists) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    // Validación básica
    if (!req.body.name || req.body.name.trim() === '') {
      return res.status(400).json({ message: 'Tag name is required' });
    }

    const newTag = db.em.create(Tag, req.body);
    await db.em.flush();
    res.status(201).json({ message: 'Tag created', data: newTag });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    const tagToUpdate = await db.em.findOne(Tag, { id });

    if (!tagToUpdate) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Validación si se actualiza el nombre
    if (req.body.name && req.body.name.trim() === '') {
      return res.status(400).json({ message: 'Tag name cannot be empty' });
    }

    // Chequeo si el nuevo nombre ya existe (solo si se está cambiando)
    if (req.body.name && req.body.name !== tagToUpdate.name) {
      const tagExists = await db.em.findOne(Tag, { name: req.body.name });
      if (tagExists) {
        return res
          .status(400)
          .json({ message: 'Tag with this name already exists' });
      }
    }

    db.em.assign(tagToUpdate, req.body);
    await db.em.flush();

    res.status(200).json({ message: 'Tag updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const tagToRemove = await db.em.findOne(Tag, { id });

    if (!tagToRemove) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Chequeo si tiene productos asociados
    const tagWithProducts = await db.em.findOne(
      Tag,
      { id },
      { populate: ['products'] }
    );

    if (tagWithProducts && tagWithProducts.products.length > 0) {
      // Como es many-to-many, simplemente removemos las asociaciones
      tagWithProducts.products.removeAll();
      await db.em.flush();
    }

    await db.em.removeAndFlush(tagToRemove);
    res.status(200).json({ message: 'Tag removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove };
