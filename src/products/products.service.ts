import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      return await this.productRepository.find({
        take: limit,
        skip: offset
      });
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
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where(`UPPER(title) =:title or slug =:slug`, {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          }).getOne();
      }

      if (!product)
        throw new NotFoundException(`product with "${term}" not found`);

      return product;
    } catch (error) {
      this.handleExecptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
      images: []
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
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
}