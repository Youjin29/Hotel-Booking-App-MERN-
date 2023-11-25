import express from 'express';
import {updateUser, deleteUser, findUser, findAllUsers} from "../controllers/user.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.put("/:id", verifyUser, updateUser);

router.delete("/:id", verifyUser, deleteUser);

router.get("/:id", verifyUser, findUser);

router.get("/", verifyAdmin, findAllUsers);



export default router;

