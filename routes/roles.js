import express from "express";
import { createRole, updateRole, getRole, deletRole} from "../controllers/role.controller.js";


const router = express.Router();

//Create Role..
router.post('/', createRole);

router.put('/:id', updateRole);

router.get('/', getRole);

router.delete('/:id', deletRole)

export default router;