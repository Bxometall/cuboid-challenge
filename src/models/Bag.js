import Base from './Base';

export default class Bag extends Base {
  static get tableName() {
    return 'bags';
  }

  static get relationMappings() {
    return {
      cuboids: {
        relation: Base.HasManyRelation,
        modelClass: 'Cuboid',
        join: {
          from: 'bags.id',
          to: 'cuboids.bagId',
        },
      },
    };
  }

  static get virtualAttributes() {
    return ['payloadVolume', 'availableVolume'];
  }

  payloadVolume() {
    let payload = 0
    if (this.cuboids) {
      this.cuboids.forEach(cuboid => {
        payload += (cuboid.toJSON()).volume
      });
    }
    return payload
  }

  availableVolume() {
    let payload = 0
    if (this.cuboids) {
      this.cuboids.forEach(cuboid => {
        payload += (cuboid.toJSON()).volume
      });
    }
    let avaiableVol = this.volume - payload
    return avaiableVol
  }
}
