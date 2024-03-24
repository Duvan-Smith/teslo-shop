import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image =>
          this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);

      return { ...product, images }
    } catch (error) {
      this.handleExecptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 5, offset = 0 } = paginationDto;

      // return 
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });

      return products.map(({ images, ...rest }) => ({
        ...rest,
        images: images.map(img => img.url)
      }))
    } catch (error) {
      this.handleExecptions(error);
    }
  }

  async findOne(term: string) {
    try {
      let product: Product;

      if (isUUID(term))
        product = await this.productRepository.findOneBy({ id: term });

      if (!product) {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where(`UPPER(title) =:title or slug =:slug`, {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          })
          .leftJoinAndSelect('prod.images', 'prodImages')
          .getOne();
      }

      if (!product)
        throw new NotFoundException(`product with "${term}" not found`);

      // return { ...product, images: product.images.map(image => image.url) };
      return product;
    } catch (error) {
      this.handleExecptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })
        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      // await this.productRepository.save(product);

      // return product;
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExecptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      //   const {affected} = await this.productRepository.delete({ id });

      // if (affected === 0)
      //   throw new BadRequestException(`Product with id "${id}" not found`);
    } catch (error) {
      this.handleExecptions(error);
    }
  }

  private handleExecptions(error: any) {
    this.logger.error(error);
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }
}