import { AppDataSource } from '../config/database';
import { TestDataSource } from '../config/test.database';
import { BeerStyle } from '../entities/BeerStyle';
import { SpotifyService } from './SpotifyService';

interface StyleWithAverage {
  style: BeerStyle;
  averageTemp: number;
}

interface RecommendationResponse {
  beerStyle: BeerStyle;
  playlist: {
    name: string;
    tracks: Array<{
      name: string;
      artist: string;
      link: string;
    }>;
  } | null;
}

export class BeerRecommendationService {
  private beerStyleRepository =
    process.env.NODE_ENV === 'test'
      ? TestDataSource.getRepository(BeerStyle)
      : AppDataSource.getRepository(BeerStyle);
  private spotifyService = new SpotifyService();

  async recommendBeerStyle(temperature: number): Promise<RecommendationResponse> {
    const beerStyles = await this.beerStyleRepository.find();

    if (beerStyles.length === 0) {
      throw new Error('No beer style found for the given temperature');
    }

    const stylesWithAverageTemp: StyleWithAverage[] = beerStyles.map((style: BeerStyle) => ({
      style,
      averageTemp: (style.minimumTemperature + style.maximumTemperature) / 2,
    }));

    const minDifference = Math.min(
      ...stylesWithAverageTemp.map((item: StyleWithAverage) =>
        Math.abs(item.averageTemp - temperature)
      )
    );

    const closestStyles = stylesWithAverageTemp
      .filter(
        (item: StyleWithAverage) => Math.abs(item.averageTemp - temperature) === minDifference
      )
      .map((item: StyleWithAverage) => item.style);

    const recommendedStyle = closestStyles.sort((a: BeerStyle, b: BeerStyle) =>
      a.name.localeCompare(b.name)
    )[0];

    const playlist = await this.spotifyService.searchPlaylist(recommendedStyle.name);

    return {
      beerStyle: recommendedStyle,
      playlist: playlist || null,
    };
  }
}
