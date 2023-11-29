import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {

    const newHotel = new Hotel(req.body)
    try{
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    }catch(err) {
        next(err);
    }
};

export const updateHotel = async (req, res, next)=> {
    
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json(updatedHotel);
    }catch(err) {
        next(err);
    }
};

export const deleteHotel = async (req, res, next)=> {
    
    try{
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted successfully.");
    }catch(err) {
        next(err);
    }
};

export const getHotel = async (req, res, next)=> {

    try{
        const getHotel = await Hotel.findById(req.params.id);
        res.status(200).json(getHotel);
    }catch(err) {
        next(err);
    }
};

export const getHotels = async (req, res, next)=> {

    const {limit, min, max , city, ...others} = req.query;
    const queryCity = city?.replace("_"," ") || " "

    try{
        const hotels = await Hotel.find({...others, city: { $regex: queryCity, $options: 'i' }, cheapestPrice:{ $gte: min || 0, $lte: max || 1000 }}).limit(limit);
        res.status(200).json(hotels);
    }catch(err) {
        next(err);
    }
};

export const countByCity = async (req, res, next) => {

    const cities = req.query.cities.split(",");

    for (var i=0; i<cities.length; i++) {
        cities[i] = cities[i].replace("_", " ");
    };
    
    try{
        const list = await Promise.all(cities.map( (city) => {
            return Hotel.countDocuments({city: { $regex: city, $options: 'i' } });
        } ))
        res.status(200).json(list);
    }catch(err) {
        next(err);
    };
};

export const countByType = async (req, res, next) => {
    
    try{
        const hotelsCount = await Hotel.countDocuments({type: { $regex: "hotel", $options: "i"} });
        const apartmentsCount = await Hotel.countDocuments({type: { $regex: "apartment", $options: "i"} });
        const resortsCount = await Hotel.countDocuments({type: { $regex: "resort", $options: "i"} });
        const villasCount = await Hotel.countDocuments({type: { $regex: "villa", $options: "i"} });
        const cabinsCount = await Hotel.countDocuments({type: { $regex: "cabin", $options: "i"} });

        res.status(200).json(
            [
                {type: "hotel", count: hotelsCount},
                {type: "apartment", count: apartmentsCount},
                {type: "resort", count: resortsCount},
                {type: "villa", count: villasCount},
                {type: "cabin", count: cabinsCount}
            ]
        );
    }catch(err) {
        next(err);
    };
};

export const getHotelRooms = async (req, res, next) => {
    
    try{
        const findHotel = await Hotel.findById(req.params.id);
        const rooms = findHotel.rooms;

        const list = await Promise.all(rooms.map((room) => {
            return Room.findById(room)
        }))
        res.status(200).json(list);
    }catch(err) {
        next(err);
    }
}