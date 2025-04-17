import { AppDataSource } from '../../config/database';
import { BeerStyle } from '../../entities/BeerStyle';

const beerStyles = [
  {
    name: 'Weissbier',
    minTemperature: -1,
    maxTemperature: 3,
  },
  {
    name: 'Pilsens',
    minTemperature: -2,
    maxTemperature: 4,
  },
  {
    name: 'Weizenbier',
    minTemperature: -4,
    maxTemperature: 6,
  },
  {
    name: 'Red ale',
    minTemperature: -5,
    maxTemperature: 5,
  },
  {
    name: 'India pale ale',
    minTemperature: -6,
    maxTemperature: 7,
  },
  {
    name: 'IPA',
    minTemperature: -7,
    maxTemperature: 10,
  },
  {
    name: 'Dunkel',
    minTemperature: -8,
    maxTemperature: 2,
  },
  {
    name: 'Imperial Stouts',
    minTemperature: -10,
    maxTemperature: 13,
  },
  {
    name: 'Brown ale',
    minTemperature: 0,
    maxTemperature: 14,
  },
];

export async function seedBeerStyles() {
  try {
    const beerStyleRepository = AppDataSource.getRepository(BeerStyle);
    const existingStyles = await beerStyleRepository.find();

    if (existingStyles.length > 0) {
      return;
    }

    for (const beerStyle of beerStyles) {
      try {
        const newStyle = beerStyleRepository.create(beerStyle);
        await beerStyleRepository.save(newStyle);
      } catch (error) {
        console.error(`Error inserting beer style ${beerStyle.name}:`, error);
        throw error;
      }
    }

    const insertedStyles = await beerStyleRepository.find();

    if (insertedStyles.length === 0) {
      throw new Error('No beer styles were inserted');
    }
  } catch (error) {
    console.error('Error seeding beer styles:', error);
    throw error;
  }
}
