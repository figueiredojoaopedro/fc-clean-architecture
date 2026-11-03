import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "Product A", 100);

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn().mockResolvedValue(product),
  findAll: jest.fn(),
});

describe("Unit test find product use case", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const useCase = new FindProductUseCase(productRepository);

    const output = await useCase.execute({ id: product.id });

    expect(output).toEqual({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  });

  it("should propagate a repository error", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockRejectedValue(new Error("Product not found"));
    const useCase = new FindProductUseCase(productRepository);

    await expect(useCase.execute({ id: product.id })).rejects.toThrow(
      "Product not found"
    );
  });
});
