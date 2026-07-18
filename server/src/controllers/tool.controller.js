import { Tool } from '../models/Tool.js';
import { AppError } from '../utils/AppError.js';
import { sanitizeObject, sanitizeText } from '../utils/sanitize.js';

const textFields = ['toolName', 'category', 'brand', 'condition', 'availability', 'borrowerName', 'notes'];

function normalizeToolPayload(body) {
  const payload = sanitizeObject(body, textFields);

  if (body.quantity !== undefined) {
    payload.quantity = Number(body.quantity);
  }

  payload.borrowDate = body.borrowDate ? new Date(body.borrowDate) : null;
  payload.returnDate = body.returnDate ? new Date(body.returnDate) : null;

  return payload;
}

function buildQuery(userId, query) {
  const filters = { owner: userId };
  const search = sanitizeText(query.search || '');
  const category = sanitizeText(query.category || '');

  if (search) {
    filters.toolName = { $regex: search, $options: 'i' };
  }

  if (category) {
    filters.category = { $regex: category, $options: 'i' };
  }

  if (['Available', 'Borrowed', 'Unavailable'].includes(query.availability)) {
    filters.availability = query.availability;
  }

  return filters;
}

function buildSort(query) {
  const direction = query.direction === 'asc' ? 1 : -1;

  if (query.sortBy === 'name') {
    return { toolName: direction };
  }

  return { createdAt: direction };
}

export async function getTools(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
    const skip = (page - 1) * limit;
    const filters = buildQuery(req.user._id, req.query);
    const sort = buildSort(req.query);

    const [tools, total] = await Promise.all([
      Tool.find(filters).sort(sort).skip(skip).limit(limit),
      Tool.countDocuments(filters)
    ]);

    res.status(200).json({
      tools,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getTool(req, res, next) {
  try {
    const tool = await Tool.findOne({ _id: req.params.id, owner: req.user._id });

    if (!tool) {
      throw new AppError('Tool not found', 404);
    }

    res.status(200).json({ tool });
  } catch (error) {
    next(error);
  }
}

export async function createTool(req, res, next) {
  try {
    const payload = normalizeToolPayload(req.body);
    const tool = await Tool.create({ ...payload, owner: req.user._id });

    res.status(201).json({ tool });
  } catch (error) {
    next(error);
  }
}

export async function updateTool(req, res, next) {
  try {
    const payload = normalizeToolPayload(req.body);
    const tool = await Tool.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      payload,
      { new: true, runValidators: true }
    );

    if (!tool) {
      throw new AppError('Tool not found', 404);
    }

    res.status(200).json({ tool });
  } catch (error) {
    next(error);
  }
}

export async function deleteTool(req, res, next) {
  try {
    const tool = await Tool.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!tool) {
      throw new AppError('Tool not found', 404);
    }

    res.status(200).json({ message: 'Tool deleted' });
  } catch (error) {
    next(error);
  }
}
