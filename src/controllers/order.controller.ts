import { Request, Response } from 'express';
import { initORM } from '../db.js';
import { Order } from '../modules/order.entity.js';
import { Product } from '../modules/product.entity.js';

const db = await initORM();

async function findAll(req: Request, res: Response) {
  try {
    const orders = await db.em.find(Order, {}, { populate: ['products'] });
    res.status(200).json({ message: 'found all orders', data: orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const orderFound = await db.em.findOneOrFail(
      Order,
      {
        id,
      },
      { populate: ['products'] }
    );
    res.status(200).json({ message: 'found order', data: orderFound });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    // Chequeo si ya existe una orden con ese número
    const orderExists = await db.em.findOne(Order, {
      orderNumber: req.body.orderNumber,
    });

    if (orderExists) {
      return res.status(400).json({ message: 'Order number already exists' });
    }

    // Validaciones específicas para orden
    if (req.body.total && req.body.total <= 0) {
      return res.status(400).json({ message: 'Total must be greater than 0' });
    }

    // Validar que el orderNumber no esté vacío
    if (!req.body.orderNumber || req.body.orderNumber.trim() === '') {
      return res.status(400).json({ message: 'Order number is required' });
    }

    // Crear la orden
    const newOrder = db.em.create(Order, {
      orderNumber: req.body.orderNumber,
      total: req.body.total || 0,
      status: req.body.status || 'proceso',
    });

    // Si se proporcionan productos, agregarlos
    if (req.body.productIds && Array.isArray(req.body.productIds)) {
      const products = await db.em.find(Product, {
        id: { $in: req.body.productIds },
      });

      if (products.length !== req.body.productIds.length) {
        return res.status(400).json({ message: 'Some products not found' });
      }

      newOrder.products.add(...products);

      // Calcular total automáticamente si no se proporcionó
      if (!req.body.total) {
        let calculatedTotal = 0;
        for (const product of products) {
          calculatedTotal += product.price;
        }
        newOrder.total = calculatedTotal;
      }
    }

    await db.em.flush();
    res.status(201).json({ message: 'Order created', data: newOrder });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);

    const orderToUpdate = await db.em.findOne(
      Order,
      { id },
      { populate: ['products'] }
    );

    if (!orderToUpdate) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validaciones específicas para actualización
    if (req.body.total !== undefined && req.body.total <= 0) {
      return res.status(400).json({ message: 'Total must be greater than 0' });
    }

    // Validar estados permitidos
    const allowedStatuses = ['proceso', 'completado', 'cancelado'];
    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    // Actualizar productos si se proporcionan
    if (req.body.productIds && Array.isArray(req.body.productIds)) {
      const products = await db.em.find(Product, {
        id: { $in: req.body.productIds },
      });

      if (products.length !== req.body.productIds.length) {
        return res.status(400).json({ message: 'Some products not found' });
      }

      orderToUpdate.products.removeAll();
      orderToUpdate.products.add(...products);

      // Recalcular total si no se proporcionó uno nuevo
      if (!req.body.total) {
        let calculatedTotal = 0;
        for (const product of products) {
          calculatedTotal += product.price;
        }
        req.body.total = calculatedTotal;
      }

      delete req.body.productIds;
    }

    db.em.assign(orderToUpdate, req.body);
    await db.em.flush();

    res.status(200).json({ message: 'Order updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const orderToRemove = await db.em.findOne(Order, { id });

    if (!orderToRemove) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verificar si la orden puede ser eliminada basado en su estado
    if (orderToRemove.status === 'completado') {
      return res.status(400).json({
        message: 'Cannot delete completed orders. Change status first.',
      });
    }

    await db.em.removeAndFlush(orderToRemove);
    res.status(200).json({ message: 'Order removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}



export { findAll, findOne, add, update, remove };
