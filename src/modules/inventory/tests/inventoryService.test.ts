import {
    describe,
    it,
    expect,
    vi,
    beforeEach
} from "vitest";

import {
    createProduct,
    createCategory,
    createWarehouse,
    createStockMovement
} from "../services/inventoryService";

beforeEach(() => {
    vi.stubGlobal("crypto", {
        randomUUID: () => "id-1"
    });
});

describe("inventoryService", () => {
    it("creates product", () => {
        const product = createProduct(
            " Laptop ",
            " SKU-001 ",
            "category-1",
            15000000
        );

        expect(product).toMatchObject({
            id: "id-1",
            name: "Laptop",
            sku: "SKU-001",
            categoryId: "category-1",
            price: 15000000
        });

        expect(product.createdAt).toBeTruthy();
    });

    it("creates category", () => {
        const category = createCategory(
            " Electronics "
        );

        expect(category).toEqual({
            id: "id-1",
            name: "Electronics"
        });
    });

    it("creates warehouse", () => {
        const warehouse = createWarehouse(
            " Main Warehouse ",
            " Batam "
        );

        expect(warehouse).toEqual({
            id: "id-1",
            name: "Main Warehouse",
            location: "Batam"
        });
    });

    it("creates stock movement", () => {
        const movement = createStockMovement(
            "product-1",
            "warehouse-1",
            "in",
            10
        );

        expect(movement).toMatchObject({
            id: "id-1",
            productId: "product-1",
            warehouseId: "warehouse-1",
            type: "in",
            quantity: 10
        });

        expect(movement.createdAt).toBeTruthy();
    });
});