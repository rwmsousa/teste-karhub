import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { BeerStyle } from '../entities/BeerStyle';

const beerStyleRepository = AppDataSource.getRepository(BeerStyle);

export class BeerStyleController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const beerStyles = await beerStyleRepository.find();
      res.json(beerStyles);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const beerStyle = await beerStyleRepository.findOne({ where: { id } });

      if (!beerStyle) {
        res.status(404).json({ error: 'Beer style not found' });
        return;
      }

      res.json(beerStyle);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      const { name, minTemperature, maxTemperature } = req.body;

      const beerStyle = beerStyleRepository.create({
        name,
        minTemperature,
        maxTemperature,
      });

      await beerStyleRepository.save(beerStyle);

      res.status(201).json(beerStyle);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, minTemperature, maxTemperature } = req.body;

      const beerStyle = await beerStyleRepository.findOne({ where: { id } });

      if (!beerStyle) {
        res.status(404).json({ error: 'Beer style not found' });
        return;
      }

      beerStyle.name = name;
      beerStyle.minTemperature = minTemperature;
      beerStyle.maxTemperature = maxTemperature;

      await beerStyleRepository.save(beerStyle);

      res.json(beerStyle);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const beerStyle = await beerStyleRepository.findOne({ where: { id } });

      if (!beerStyle) {
        res.status(404).json({ error: 'Beer style not found' });
        return;
      }

      await beerStyleRepository.remove(beerStyle);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
