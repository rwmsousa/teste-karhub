import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('beer_styles')
export class BeerStyle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: false })
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('float')
  minimumTemperature!: number;

  @Column('float')
  maximumTemperature!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
