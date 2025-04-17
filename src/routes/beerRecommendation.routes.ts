import { Router } from 'express';
import { BeerRecommendationController } from '../controllers/BeerRecommendationController';

const router = Router();
const beerRecommendationController = new BeerRecommendationController();

router.post('/recommendation', (req, res) => {
  beerRecommendationController.recommend(req, res);
});

export default router;
