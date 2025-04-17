import { AppDataSource } from '../config/database';
import { BeerStyle } from '../entities/BeerStyle';

interface BeerStyleWithAverage {
  beerStyle: BeerStyle;
  average: number;
}

export class BeerStyleService {
  private beerStyleRepository = AppDataSource.getRepository(BeerStyle);

  private calculateAverage(min: number, max: number): number {
    return (min + max) / 2;
  }

  private findClosestStyles(
    temperature: number,
    styles: BeerStyle[],
  ): BeerStyle[] {
    const stylesWithAverage = styles.map((style) => ({
      beerStyle: style,
      average: this.calculateAverage(
        style.minTemperature,
        style.maxTemperature,
      ),
    }));

    const closestAverage = stylesWithAverage.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.average - temperature);
      const currDiff = Math.abs(curr.average - temperature);

      if (currDiff < prevDiff) return curr;
      if (currDiff === prevDiff) {
        return curr.beerStyle.name.localeCompare(prev.beerStyle.name) < 0
          ? curr
          : prev;
      }
      return prev;
    });

    return stylesWithAverage
      .filter(
        (style) =>
          Math.abs(style.average - temperature) ===
          Math.abs(closestAverage.average - temperature),
      )
      .map((style) => style.beerStyle)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findBestStyle(temperature: number): Promise<BeerStyle[]> {
    const styles = await this.beerStyleRepository.find();
    return this.findClosestStyles(temperature, styles);
  }
}
