import { faker } from '@faker-js/faker';
import { Product } from '@models/products.interface';

export const generateOneProduct = (): Product => {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(), 10),
    description: faker.commerce.productDescription(),
    images: [faker.image.url(), faker.image.url()],
    category: {
      id: faker.number.int(),
      name: 'Category 1',
    },
  };
};

export const generateManyProducts = (size: number = 10): Product[] => {
  const products: Product[] = [];

  for (let i = 0; i < size; i++) {
    const product = generateOneProduct();
    products.push(product);
  }

  return [...products];
};
