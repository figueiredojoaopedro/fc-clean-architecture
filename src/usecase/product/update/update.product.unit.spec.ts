import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("123", "Product A", 100);

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn().mockResolvedValue(product),
  findAll: jest.fn(),
});

describe("Unit test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);

    const output = await useCase.execute({
      id: product.id,
      name: "Updated Product",
      price: 150,
    });

    expect(output).toEqual({
      id: product.id,
      name: "Updated Product",
      price: 150,
    });
    expect(productRepository.update).toHaveBeenCalledWith(product);
  });
});
