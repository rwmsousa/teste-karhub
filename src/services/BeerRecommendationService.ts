import { AppDataSource } from '../config/database';
import { TestDataSource } from '../config/test.database';
import { BeerStyle } from '../entities/BeerStyle';

interface StyleWithAverage {
  style: BeerStyle;
  averageTemp: number;
}

export class BeerRecommendationService {
  private beerStyleRepository =
    process.env.NODE_ENV === 'test'
      ? TestDataSource.getRepository(BeerStyle)
      : AppDataSource.getRepository(BeerStyle);

  async recommendBeerStyle(temperature: number): Promise<BeerStyle> {
    const beerStyles = await this.beerStyleRepository.find();

    if (beerStyles.length === 0) {
      throw new Error('No beer style found for the given temperature');
    }

    // Calcula a média de temperatura e a diferença para cada estilo
    const stylesWithAverageTemp: StyleWithAverage[] = beerStyles.map(
      (style: BeerStyle) => ({
        style,
        averageTemp: (style.minimumTemperature + style.maximumTemperature) / 2,
      }),
    );

    // Encontra a menor diferença de temperatura
    const minDifference = Math.min(
      ...stylesWithAverageTemp.map((item: StyleWithAverage) =>
        Math.abs(item.averageTemp - temperature),
      ),
    );

    // Filtra os estilos com a menor diferença de temperatura
    const closestStyles = stylesWithAverageTemp
      .filter(
        (item: StyleWithAverage) =>
          Math.abs(item.averageTemp - temperature) === minDifference,
      )
      .map((item: StyleWithAverage) => item.style);

    // Se houver mais de um estilo com a mesma diferença de temperatura,
    // retorna o primeiro em ordem alfabética
    return closestStyles.sort((a: BeerStyle, b: BeerStyle) =>
      a.name.localeCompare(b.name),
    )[0];
  }
}
