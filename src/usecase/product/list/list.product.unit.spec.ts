import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const products = [
  new Product("1", "Product A", 100),
  new Product("2", "Product B", 200),
];

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn().mockResolvedValue(products),
});

describe("Unit test list product use case", () => {
  it("should list products", async () => {
    const productRepository = MockRepository();
    const useCase = new ListProductUseCase(productRepository);

    const output = await useCase.execute({});

    expect(output).toEqual({
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      })),
    });
  });
});
