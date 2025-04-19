import { Router } from 'express';
import { BeerStyleController } from '../controllers/BeerStyleController';
import { seedBeerStyles } from '../database/seeds/BeerStyleSeeder';

const router = Router();
const beerStyleController = new BeerStyleController();

router.post('/seed', async (req, res) => {
  try {
    await seedBeerStyles();
    res.json({ message: 'Beer styles seeded successfully' });
  } catch (error) {
    console.error('Error seeding beer styles:', error);
    res.status(500).json({ message: 'Error seeding beer styles' });
  }
});

router.get('/', (req, res) => {
  beerStyleController.index(req, res);
});

router.get('/:id', (req, res) => {
  beerStyleController.show(req, res);
});

router.post('/', (req, res) => {
  beerStyleController.store(req, res);
});

router.put('/:id', (req, res) => {
  beerStyleController.update(req, res);
});

router.delete('/:id', (req, res) => {
  beerStyleController.delete(req, res);
});

export default router;
