import { Request, Response } from 'express';
import { BeerStyle } from '../entities/BeerStyle';
import { AppDataSource } from '../config/database';
import { SpotifyService } from '../services/SpotifyService';

export class BeerRecommendationController {
  private beerStyleRepository = AppDataSource.getRepository(BeerStyle);
  private spotifyService = new SpotifyService();

  async recommend(req: Request, res: Response) {
    try {
      const { temperature } = req.body;

      if (typeof temperature !== 'number') {
        return res.status(400).json({
          message: 'Temperature must be a number',
        });
      }

      const beerStyles = await this.beerStyleRepository.find();

      if (beerStyles.length === 0) {
        return res.status(404).json({
          message: 'No beer styles found',
        });
      }

      const stylesWithAverage = beerStyles.map((style) => {
        const averageTemp = (style.minTemperature + style.maxTemperature) / 2;
        return {
          ...style,
          averageTemp,
        };
      });

      const closestStyle = stylesWithAverage.reduce((closest, current) => {
        const currentDiff = Math.abs(current.averageTemp - temperature);
        const closestDiff = Math.abs(closest.averageTemp - temperature);

        if (currentDiff < closestDiff) {
          return current;
        } else if (currentDiff === closestDiff) {
          return current.name.localeCompare(closest.name) < 0
            ? current
            : closest;
        }
        return closest;
      });

      const playlist = await this.spotifyService.searchPlaylist(
        closestStyle.name,
      );

      if (!playlist) {
        return res.status(404).json({
          message: 'No playlist found for this beer style',
          beerStyle: {
            name: closestStyle.name,
            minTemperature: closestStyle.minTemperature,
            maxTemperature: closestStyle.maxTemperature,
            averageTemperature: closestStyle.averageTemp,
          },
        });
      }

      return res.json({
        beerStyle: {
          name: closestStyle.name,
          minTemperature: closestStyle.minTemperature,
          maxTemperature: closestStyle.maxTemperature,
          averageTemperature: closestStyle.averageTemp,
        },
        playlist,
      });
    } catch (error) {
      console.error('Error in beer recommendation:', error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}
