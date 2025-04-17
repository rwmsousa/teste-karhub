import { Router, Request, Response } from 'express';
import { BeerStyleController } from '../controllers/BeerStyleController';

const router = Router();
const beerStyleController = new BeerStyleController();

router.get('/', async (req: Request, res: Response) => {
  await beerStyleController.index(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await beerStyleController.show(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await beerStyleController.store(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await beerStyleController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await beerStyleController.delete(req, res);
});

export default router;
