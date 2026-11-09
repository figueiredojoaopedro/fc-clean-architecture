import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product A",
        price: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product A");
    expect(response.body.price).toBe(100);
    expect(response.body.id).toBeTruthy();
  });

  it("should not create a product with an unsupported type", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "unsupported",
        name: "Product",
        price: 100,
      });

    expect(response.status).toBe(500);
  });

  it("should list products as JSON and XML", async () => {
    await request(app).post("/product").send({
      type: "a",
      name: "Product A",
      price: 100,
    });
    await request(app).post("/product").send({
      type: "b",
      name: "Product B",
      price: 200,
    });

    const jsonResponse = await request(app).get("/product").send();

    expect(jsonResponse.status).toBe(200);
    expect(jsonResponse.body.products).toHaveLength(2);
    expect(jsonResponse.body.products[0]).toMatchObject({
      name: "Product A",
      price: 100,
    });
    expect(jsonResponse.body.products[1]).toMatchObject({
      name: "Product B",
      price: 400,
    });

    const xmlResponse = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(xmlResponse.status).toBe(200);
    expect(xmlResponse.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(xmlResponse.text).toContain("<products>");
    expect(xmlResponse.text).toContain("<product>");
    expect(xmlResponse.text).toContain("<name>Product A</name>");
    expect(xmlResponse.text).toContain("<price>100</price>");
    expect(xmlResponse.text).toContain("<name>Product B</name>");
    expect(xmlResponse.text).toContain("<price>400</price>");
    expect(xmlResponse.text).toContain("</products>");
  });
});
