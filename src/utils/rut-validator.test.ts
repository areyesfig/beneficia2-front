import { validateRut, formatRut, cleanRut, getCheckDigit } from "./rut-validator";

describe("rut-validator", () => {
  describe("validateRut", () => {
    it("valida RUT chileno correcto con puntos y guión", () => {
      expect(validateRut("12.345.678-5")).toBe(true);
    });
    it("rechaza RUT con dígito verificador incorrecto", () => {
      expect(validateRut("12.345.678-9")).toBe(false);
    });
    it("acepta RUT sin formato", () => {
      expect(validateRut("123456785")).toBe(true);
    });
    it("rechaza string vacío", () => {
      expect(validateRut("")).toBe(false);
    });
  });

  describe("formatRut", () => {
    it("formatea a XX.XXX.XXX-X", () => {
      expect(formatRut("123456785")).toBe("12.345.678-5");
    });
    it("devuelve vacío para string vacío", () => {
      expect(formatRut("")).toBe("");
    });
  });

  describe("cleanRut", () => {
    it("quita puntos y guión", () => {
      expect(cleanRut("12.345.678-5")).toBe("123456785");
    });
    it("convierte k a K", () => {
      expect(cleanRut("11.111.111-k")).toBe("11111111K");
    });
  });

  describe("getCheckDigit", () => {
    it("calcula dígito verificador para cuerpo 12345678", () => {
      expect(getCheckDigit("12345678")).toBe("5");
    });
  });
});
