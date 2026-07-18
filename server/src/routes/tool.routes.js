import { Router } from 'express';
import {
  createTool,
  deleteTool,
  getTool,
  getTools,
  updateTool
} from '../controllers/tool.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const toolRules = [
  { field: 'toolName', label: 'Tool name', type: 'string', required: true, minLength: 2, maxLength: 120 },
  { field: 'category', label: 'Category', type: 'string', required: true, minLength: 2, maxLength: 80 },
  { field: 'brand', label: 'Brand', type: 'string', required: true, minLength: 2, maxLength: 80 },
  { field: 'condition', label: 'Condition', type: 'string', required: true, enum: ['New', 'Good', 'Fair', 'Needs Repair'] },
  { field: 'quantity', label: 'Quantity', type: 'number', required: true, min: 0 },
  { field: 'availability', label: 'Availability', type: 'string', required: true, enum: ['Available', 'Borrowed', 'Unavailable'] },
  { field: 'borrowerName', label: 'Borrower name', type: 'string', maxLength: 120 },
  { field: 'notes', label: 'Notes', type: 'string', maxLength: 1000 }
];

router.use(authenticate);

router.get('/', getTools);
router.get('/:id', getTool);
router.post('/', validateBody(toolRules), createTool);
router.put('/:id', validateBody(toolRules), updateTool);
router.delete('/:id', deleteTool);

export default router;
