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
      description: 'Cerveja de trigo alemã tradicional',
      minimumTemperature: -1,
      maximumTemperature: 3,
    },
    {
      name: 'Pilsens',
      description: 'Cerveja clara e refrescante do tipo Pilsen',
      minimumTemperature: -2,
      maximumTemperature: 4,
    },
    {
      name: 'Weizenbier',
      description: 'Cerveja de trigo alemã',
      minimumTemperature: -4,
      maximumTemperature: 6,
    },
    {
      name: 'Red ale',
      description: 'Cerveja ale avermelhada',
      minimumTemperature: -5,
      maximumTemperature: 5,
    },
    {
      name: 'India pale ale',
      description: 'India Pale Ale tradicional',
      minimumTemperature: -6,
      maximumTemperature: 7,
    },
    {
      name: 'IPA',
      description: 'India Pale Ale moderna',
      minimumTemperature: -7,
      maximumTemperature: 10,
    },
    {
      name: 'Dunkel',
      description: 'Cerveja escura alemã',
      minimumTemperature: -8,
      maximumTemperature: 2,
    },
    {
      name: 'Imperial Stouts',
      description: 'Cerveja escura e forte do tipo Imperial Stout',
      minimumTemperature: -10,
      maximumTemperature: 13,
    },
    {
      name: 'Brown ale',
      description: 'Cerveja ale de cor marrom',
      minimumTemperature: 0,
      maximumTemperature: 14,
    },
  ];

  await beerStyleRepository.clear();

  for (const beerStyle of beerStyles) {
    await beerStyleRepository.save(beerStyle);
  }
}
