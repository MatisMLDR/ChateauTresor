import { GET } from "@/app/api/chateaux/route";

// Mock de cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => "mock-cookie-value"), // Remplacez par la valeur que vous attendez
  })),
}));

describe("/app/api/chateaux API", () => {
  it("should return a 200 status with a mocked cookie value", async () => {
    const response = await GET();

    const json = await response.json();
    console.log(json);
    expect(json).toEqual({ message: "Cookie value: mock-cookie-value" });

    expect(response.status).toBe(200);

    
  });
});
