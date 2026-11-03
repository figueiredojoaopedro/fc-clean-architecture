import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => ({
  create: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  findAll: jest.fn(),
});

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const output = await useCase.execute({
      type: "a",
      name: "Product A",
      price: 100,
    });

    expect(output).toEqual({
      id: expect.any(String),
      name: "Product A",
      price: 100,
    });
    expect(productRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should reject an unsupported product type", async () => {
    const useCase = new CreateProductUseCase(MockRepository());

    await expect(
      useCase.execute({ type: "unsupported", name: "Product", price: 100 }),
    ).rejects.toThrow("Product type not supported");
  });
});
