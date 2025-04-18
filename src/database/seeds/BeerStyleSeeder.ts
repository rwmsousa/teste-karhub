import { AppDataSource } from '../../config/database';
import { TestDataSource } from '../../config/test.database';
import { BeerStyle } from '../../entities/BeerStyle';

export async function seedBeerStyles() {
  const dataSource =
    process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
  const beerStyleRepository = dataSource.getRepository(BeerStyle);

  const beerStyles = [
    {
      name: 'Weissbier',
      description:
        'Cerveja de trigo alemã, refrescante e com notas de banana e cravo',
      minimumTemperature: 3,
      maximumTemperature: 6,
    },
    {
      name: 'Pilsner',
      description: 'Cerveja clara e refrescante com amargor pronunciado',
      minimumTemperature: 4,
      maximumTemperature: 7,
    },
    {
      name: 'IPA',
      description: 'India Pale Ale, cerveja amarga e aromática',
      minimumTemperature: 5,
      maximumTemperature: 8,
    },
    {
      name: 'Stout',
      description: 'Cerveja escura e encorpada com notas de café e chocolate',
      minimumTemperature: 8,
      maximumTemperature: 12,
    },
    {
      name: 'Belgian Ale',
      description: 'Cerveja belga complexa e frutada',
      minimumTemperature: 6,
      maximumTemperature: 10,
    },
  ];

  await beerStyleRepository.save(beerStyles);
}
