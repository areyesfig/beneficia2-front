import { formatCurrency, formatCurrencyCompact } from './format-currency';

describe('format-currency', () => {
  describe('formatCurrency', () => {
    it('formatea número con separador de miles (es-CL)', () => {
      expect(formatCurrency(98750)).toBe('$ 98.750');
    });

    it('formatea cero', () => {
      expect(formatCurrency(0)).toBe('$ 0');
    });

    it('devuelve "$ --" para undefined', () => {
      expect(formatCurrency(undefined)).toBe('$ --');
    });

    it('devuelve "$ --" para null', () => {
      expect(formatCurrency(null)).toBe('$ --');
    });

    it('devuelve "$ --" para NaN', () => {
      expect(formatCurrency(Number.NaN)).toBe('$ --');
    });

    it('formatea números grandes', () => {
      expect(formatCurrency(1130000)).toBe('$ 1.130.000');
    });
  });

  describe('formatCurrencyCompact', () => {
    it('formatea sin espacio entre $ y el número', () => {
      expect(formatCurrencyCompact(45000)).toBe('$45.000');
    });

    it('devuelve "$ --" para undefined', () => {
      expect(formatCurrencyCompact(undefined)).toBe('$ --');
    });

    it('devuelve "$ --" para null', () => {
      expect(formatCurrencyCompact(null)).toBe('$ --');
    });

    it('devuelve "$ --" para NaN', () => {
      expect(formatCurrencyCompact(Number.NaN)).toBe('$ --');
    });
  });
});
