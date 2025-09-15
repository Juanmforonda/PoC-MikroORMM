import { Request, Response } from 'express';
import { initORM } from '../db.js';
import { Product } from '../modules/product.entity.js';
import { Category } from '../modules/category.entity.js';
import { Tag } from '../modules/tag.entity.js'; // Importar Tag

const db = await initORM();

async function findAll(req: Request, res: Response) {
  const { categoryId, tagID, minPrice, maxPrice, inStock } = req.query;

  // Si se proporcionan filtros, aplicarlos

  const filters: any = {}; // Objeto para almacenar los filtros
  if (categoryId === 'none') {
    filters.category = null;
  } else if (categoryId) {
    filters.category = { id: Number(categoryId) };
  }
  if (tagID) {
    filters.tags = { id: Number(tagID) };
  } else if (tagID === 'none') {
    filters.tags = { $isEmpty: true };
  }
  if (minPrice) {
    filters.price = { $gte: Number(minPrice) };
  }
  if (maxPrice) {
    filters.price = { ...filters.price, $lte: Number(maxPrice) };
  }
  //Filtro de stock con 3 opciones
  if (inStock === 'true') {
    filters.stock = { $gt: 0 }; // mayor a 0, es decir, en stock
  } else if (inStock === 'false') {
    filters.stock = { $lte: 0 }; // menor o igual a 0, es decir, sin stock
  }
  //No se aplican filtros de stock si inStock no está definido

  try {
    const products = await db.em.find(Product, filters, {
      populate: ['category', 'tags', 'orders'],
    });
    res.status(200).json({ message: 'list of products', data: products });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
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

    // Manejar tags si se proporcionan
    if (req.body.tagIds && Array.isArray(req.body.tagIds)) {
      const tagIds = req.body.tagIds;

      // Verificar que todos los tags existen
      const tags = await db.em.find(Tag, { id: { $in: tagIds } });

      if (tags.length !== tagIds.length) {
        // Encontrar los IDs que no existen
        const existingTagIds = tags.map((tag) => tag.id);
        const nonExistingTagIds = tagIds.filter(
          (id: number) => !existingTagIds.includes(id)
        );

        return res.status(400).json({
          message: 'Some tags were not found',
          nonExistingTagIds,
        });
      }

      // Asignar los tags al producto
      req.body.tags = tags;
      delete req.body.tagIds;
    }

    const newProduct = db.em.create(Product, req.body);
    await db.em.flush();

    // Recargar el producto con las relaciones populadas
    await db.em.populate(newProduct, ['category', 'tags', 'orders']);

    res.status(201).json({ message: 'Product created', data: newProduct });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    const productToUpdate = await db.em.findOne(
      Product,
      { id },
      { populate: ['tags'] }
    );

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

    // Manejar tags si se proporcionan
    if (req.body.tagIds !== undefined) {
      if (Array.isArray(req.body.tagIds)) {
        const tagIds = req.body.tagIds;

        // Verificar que todos los tags existen
        const tags = await db.em.find(Tag, { id: { $in: tagIds } });

        if (tags.length !== tagIds.length) {
          const existingTagIds = tags.map((tag) => tag.id);
          const nonExistingTagIds = tagIds.filter(
            (id: number) => !existingTagIds.includes(id)
          );

          return res.status(400).json({
            message: 'Some tags were not found',
            nonExistingTagIds,
          });
        }

        // Reemplazar todos los tags existentes
        productToUpdate.tags.set(tags);
      } else if (req.body.tagIds === null) {
        // Limpiar todos los tags
        productToUpdate.tags.removeAll();
      }

      delete req.body.tagIds;
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

    await db.em.removeAndFlush(productToRemove);
    res.status(200).json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

//Otras queries

async function findByCategory(req: Request, res: Response) {
  const categoryId = Number.parseInt(req.params.categoryId);
  try {
    const products = await db.em.find(
      Product,
      { category: { id: categoryId } },
      { populate: ['category', 'tags', 'orders'] }
    );
    res.status(200).json({ message: 'list of products', data: products });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
}

async function findOutOfStock(req: Request, res: Response) {
  try {
    const products = await db.em.find(
      Product,
      { stock: { $lte: 0 } },
      { populate: ['category', 'tags', 'orders'] }
    );
    res
      .status(200)
      .json({ message: 'list of out-of-stock products', data: products });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
}

async function actualizarStockMasivo(req: Request, res: Response) {
  const { incremento = 50 } = req.body; // Cantidad a agregar

  try {
    const em = db.em.fork(); // Nuevo contexto

    // Obtener productos con stock bajo
    const productosAntesUpdate = await em.find(
      Product,
      {
        stock: { $lt: 10 },
      },
      {
        populate: ['category'],
      }
    );

    console.log(
      ` Encontrados ${productosAntesUpdate.length} productos con stock bajo`
    );

    if (productosAntesUpdate.length === 0) {
      return res.json({
        message: 'No hay productos con stock bajo',
        productosActualizados: 0,
      });
    }

    // Modificar en memoria
    productosAntesUpdate.forEach((producto) => {
      const stockAnterior = producto.stock;
      producto.stock += incremento;
      producto.updatedAt = new Date();

      console.log(` ${producto.name}: ${stockAnterior} → ${producto.stock}`);
    });
    // UNA SOLA QUERY OPTIMIZADA
    const startTime = Date.now();
    await em.flush();
    const endTime = Date.now();

    console.log(`Query ejecutada en ${endTime - startTime}ms`);

    // Obtener productos DESPUÉS para comparar
    const productosActualizados = await em.find(
      Product,
      {
        id: { $in: productosAntesUpdate.map((p) => p.id) },
      },
      {
        populate: ['category'],
      }
    );

    res.json({
      message: 'Stock actualizado masivamente',
      productosActualizados: productosActualizados.length,
      tiempoEjecucion: `${endTime - startTime}ms`,
      productos: productosActualizados.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category?.name || 'Sin categoría',
        stockNuevo: p.stock,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error(' Error en actualización masiva:', error);
    res.status(500).json({
      message: 'Error actualizando stock',
      error: error.message,
    });
  }
}

export {
  findAll,
  findOne,
  add,
  update,
  remove,
  findByCategory,
  findOutOfStock,
  actualizarStockMasivo,
};
