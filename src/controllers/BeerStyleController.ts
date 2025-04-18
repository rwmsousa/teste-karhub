import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { TestDataSource } from '../config/test.database';
import { BeerStyle } from '../entities/BeerStyle';

export class BeerStyleController {
  private beerStyleRepository =
    process.env.NODE_ENV === 'test'
      ? TestDataSource.getRepository(BeerStyle)
      : AppDataSource.getRepository(BeerStyle);

  async index(req: Request, res: Response): Promise<void> {
    try {
      const beerStyles = await this.beerStyleRepository.find();
      res.json(beerStyles);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const beerStyle = await this.beerStyleRepository.findOne({
        where: { id },
      });

      if (!beerStyle) {
        res.status(404).json({ message: 'Beer style not found' });
        return;
      }

      res.json(beerStyle);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, minimumTemperature, maximumTemperature } =
        req.body;

      if (
        !name ||
        !description ||
        minimumTemperature === undefined ||
        maximumTemperature === undefined
      ) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      if (
        typeof minimumTemperature !== 'number' ||
        typeof maximumTemperature !== 'number'
      ) {
        res.status(400).json({ message: 'Temperature must be a number' });
        return;
      }

      if (minimumTemperature > maximumTemperature) {
        res.status(400).json({
          message:
            'Minimum temperature cannot be greater than maximum temperature',
        });
        return;
      }

      const beerStyle = this.beerStyleRepository.create({
        name,
        description,
        minimumTemperature,
        maximumTemperature,
      });

      await this.beerStyleRepository.save(beerStyle);

      res.status(201).json(beerStyle);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, minimumTemperature, maximumTemperature } =
        req.body;

      const beerStyle = await this.beerStyleRepository.findOne({
        where: { id },
      });

      if (!beerStyle) {
        res.status(404).json({ message: 'Beer style not found' });
        return;
      }

      if (name !== undefined) {
        if (!name) {
          res.status(400).json({ message: 'Name cannot be empty' });
          return;
        }
        beerStyle.name = name;
      }

      if (description !== undefined) {
        if (!description) {
          res.status(400).json({ message: 'Description cannot be empty' });
          return;
        }
        beerStyle.description = description;
      }

      if (
        minimumTemperature !== undefined ||
        maximumTemperature !== undefined
      ) {
        if (
          minimumTemperature === undefined ||
          maximumTemperature === undefined
        ) {
          res.status(400).json({
            message: 'Both minimum and maximum temperature must be provided',
          });
          return;
        }

        if (
          typeof minimumTemperature !== 'number' ||
          typeof maximumTemperature !== 'number'
        ) {
          res.status(400).json({ message: 'Temperature must be a number' });
          return;
        }

        if (minimumTemperature > maximumTemperature) {
          res.status(400).json({
            message:
              'Minimum temperature cannot be greater than maximum temperature',
          });
          return;
        }

        beerStyle.minimumTemperature = minimumTemperature;
        beerStyle.maximumTemperature = maximumTemperature;
      }

      await this.beerStyleRepository.save(beerStyle);

      res.json(beerStyle);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const beerStyle = await this.beerStyleRepository.findOne({
        where: { id },
      });

      if (!beerStyle) {
        res.status(404).json({ message: 'Beer style not found' });
        return;
      }

      await this.beerStyleRepository.remove(beerStyle);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
