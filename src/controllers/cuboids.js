import HttpStatus from 'http-status-codes';
import Bag from '../models/Bag';
import Cuboid from '../models/Cuboid';
import { byId } from './filters';

export const list = async (req, res) => {
  const cuboids = await Cuboid.query()
    .where(byId(req.query))
    .withGraphFetched('bag');
  return res.status(200).json(cuboids);
};

export const get = async (req, res) => {
  const { id } = req.params
  const cuboid = await Cuboid.query().findById(id)
  if (!cuboid) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
  return res.status(200).json((cuboid).toJSON());
};

export const create = async (req, res) => {
  const { width, height, depth, bagId } = req.body;
  
  const bag = await Bag.query().findById(bagId)
  
  const cuboids = await Cuboid.query().where('bag_id', bag.id)
  let volumeOfAllCuboids = (width * height * depth)
  cuboids.forEach(cbds => {
    volumeOfAllCuboids += (cbds.toJSON()).volume
  })
  
  if (volumeOfAllCuboids > bag.volume) {
    const body = { message: 'Insufficient capacity in bag' }
    return res.status(HttpStatus.BAD_REQUEST).json(body);
  }

  const cuboid = await Cuboid.query().insert({
    width,
    height,
    depth,
    bagId,
  });
  return res.status(HttpStatus.CREATED).json(cuboid);
};
