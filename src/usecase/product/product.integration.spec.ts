import { Sequelize } from "sequelize-typescript";
import Product from "../../domain/product/entity/product";
import ProductModel from "../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create/create.product.usecase";
import FindProductUseCase from "./find/find.product.usecase";
import ListProductUseCase from "./list/list.product.usecase";
import UpdateProductUseCase from "./update/update.product.usecase";

describe("Product use cases integration tests", () => {
  let sequelize: Sequelize;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync({ force: true });

    productRepository = new ProductRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create and persist a product", async () => {
    const useCase = new CreateProductUseCase(productRepository);

    const output = await useCase.execute({
      type: "a",
      name: "Product A",
      price: 100,
    });

    expect(await productRepository.find(output.id)).toEqual(
      new Product(output.id, "Product A", 100),
    );
  });

  it("should find a persisted product", async () => {
    await productRepository.create(new Product("1", "Product A", 100));
    const useCase = new FindProductUseCase(productRepository);

    await expect(useCase.execute({ id: "1" })).resolves.toEqual({
      id: "1",
      name: "Product A",
      price: 100,
    });
  });

  it("should list persisted products", async () => {
    await productRepository.create(new Product("1", "Product A", 100));
    await productRepository.create(new Product("2", "Product B", 200));
    const useCase = new ListProductUseCase(productRepository);

    await expect(useCase.execute({})).resolves.toEqual({
      products: [
        { id: "1", name: "Product A", price: 100 },
        { id: "2", name: "Product B", price: 200 },
      ],
    });
  });

  it("should update and persist a product", async () => {
    await productRepository.create(new Product("1", "Product A", 100));
    const useCase = new UpdateProductUseCase(productRepository);

    await expect(
      useCase.execute({ id: "1", name: "Updated Product", price: 150 }),
    ).resolves.toEqual({
      id: "1",
      name: "Updated Product",
      price: 150,
    });

    await expect(productRepository.find("1")).resolves.toEqual(
      new Product("1", "Updated Product", 150),
    );
  });
});
