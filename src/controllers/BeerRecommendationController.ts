import { Request, Response } from 'express';
import { BeerRecommendationService } from '../services/BeerRecommendationService';

interface CustomError extends Error {
  message: string;
}

export class BeerRecommendationController {
  private beerRecommendationService = new BeerRecommendationService();

  async recommend(req: Request, res: Response): Promise<Response> {
    try {
      const { temperature } = req.body;
      const temperatureNumber = Number(temperature);

      if (isNaN(temperatureNumber)) {
        return res.status(400).json({
          message: 'Temperature must be a number',
        });
      }

      const recommendation =
        await this.beerRecommendationService.recommendBeerStyle(
          temperatureNumber,
        );

      if (!recommendation.playlist) {
        return res.status(404).json({
          message: 'No playlist found for the recommended beer style',
        });
      }

      return res.json({
        beerStyle: recommendation.beerStyle.name,
        playlist: recommendation.playlist,
      });
    } catch (error) {
      const customError = error as CustomError;

      if (
        customError.message === 'No beer style found for the given temperature'
      ) {
        return res.status(404).json({
          message: customError.message,
        });
      }

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}
