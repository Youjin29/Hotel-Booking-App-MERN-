import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid

    const newRoom = new Room(req.body);
    
    try {
        const savedRoom = await newRoom.save()
        try {
            const hotel = await Hotel.findByIdAndUpdate(hotelId, { $push: {rooms: savedRoom._id} })
            if (!hotel) {
                next(createError(404, "Hotel not found"));
            };
        } catch(err) {
            next(err)
        }

        const hotel = await Hotel.findById(hotelId);
        
        res.status(200).json([savedRoom, hotel]);
    } catch(err) {
        next(err)
    }
};

export const updateRoom = async (req, res, next)=> {
    
    try{
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json(updatedRoom);
    }catch(err) {
        next(err);
    }
};

export const updateRoomAvailability = async (req, res, next)=> {
    
    try{
        const updatedRoomAvailability = await Room.updateOne({"roomNumbers._id": req.params.id},{
            $push: {
                "roomNumbers.$.unavailableDates": req.body.dates
            }
        });
        res.status(200).json(updatedRoomAvailability);
    }catch(err) {
        next(err);
    }
};

export const deleteRoom = async (req, res, next)=> {
    
    try{
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        try{
            await Hotel.findByIdAndUpdate(req.params.hotelid, { $pull: {rooms: req.params.id} });
        } catch(err) {
            next(err)
        }

        res.status(200).json("Deleted successfully.");
    }catch(err) {
        next(err);
    }
};

export const getRoom = async (req, res, next)=> {

    try{
        const getRoom = await Room.findById(req.params.id);
        res.status(200).json(getRoom);
    }catch(err) {
        next(err);
    }
};

export const getRooms = async (req, res, next)=> {

    try{
        const rooms = await Room.find();
        res.status(200).json(rooms);
    }catch(err) {
        next(err);
    }
};

export const getReservedRooms = async (req, res, next) => {

    const selectedRooms = req.body;
    try {
        const list = await Promise.all( Object.keys(selectedRooms).map( async (roomId) => {
            try {
                const roomType = await Room.findById(roomId);
                const roomNumbers = [];
                for (const room of roomType.roomNumbers) {
                    if (selectedRooms[roomId].includes(room._id.toString())) {
                        roomNumbers.push(room.number);
                    } else {
                        continue;
                    }
                }
                return { roomType: roomType.title, roomNumbers: roomNumbers, roomPrice: roomType.price};
            } catch (err) {
                next(err);
            }
        }))
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
}

export const testRooms = async (req, res, next) => {
    try {
        const updatedRoom = await Room.updateOne({"roomNumbers._id":"6543af924362f13de23975a6"}, 
        { $push: {"roomNumbers.$.unavailableDates": ["1", "2", "3", "4"] }}, {new: true})
        res.status(200).json(updatedRoom);
    } catch (err) {
        next(err)
    }
}