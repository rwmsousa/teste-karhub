import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToBeerStyles1713381516000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro, adicionamos a coluna description como nullable
    await queryRunner.query(
      `ALTER TABLE "beer_styles" ADD COLUMN "description" text`,
    );

    // Adicionamos as colunas de temperatura como nullable inicialmente
    await queryRunner.query(
      `ALTER TABLE "beer_styles" ADD COLUMN "minimumTemperature" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "beer_styles" ADD COLUMN "maximumTemperature" double precision`,
    );

    // Atualizamos os registros existentes com valores padrão
    await queryRunner.query(`
      UPDATE "beer_styles"
      SET
        "description" = 'Uma cerveja refrescante e leve, perfeita para dias quentes.',
        "minimumTemperature" = 0,
        "maximumTemperature" = 10
      WHERE "description" IS NULL
    `);

    // Agora podemos tornar as colunas NOT NULL
    await queryRunner.query(
      `ALTER TABLE "beer_styles" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "beer_styles" ALTER COLUMN "minimumTemperature" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "beer_styles" ALTER COLUMN "maximumTemperature" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "beer_styles" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "beer_styles" DROP COLUMN "minimumTemperature"`,
    );
    await queryRunner.query(
      `ALTER TABLE "beer_styles" DROP COLUMN "maximumTemperature"`,
    );
  }
}
