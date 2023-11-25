import express from "express";
import { createRoom, updateRoom, deleteRoom, getRoom, getRooms, updateRoomAvailability, getReservedRooms, testRooms } from "../controllers/room.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/createRoom/:hotelid", verifyAdmin, createRoom);

//UPDATE
router.put("/update/:id", verifyAdmin, updateRoom);

//UPDATE ROOM AVAILABILITY
 router.put("/availability/:id", updateRoomAvailability);

//DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);

//GET
router.get("/getRoom/:id", getRoom);

//GET ALL
router.get("/", getRooms);

//GET RESERVED ROOMS
router.post("/reservedRooms", getReservedRooms);

router.put("/testroom", testRooms);

export default router