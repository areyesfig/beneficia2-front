jest.mock('@/config/api', () => ({ API_URL: 'http://test:3000' }));

import {
  mapMatchesToBenefitItems,
  type MatchResult,
} from './useUserMatches';

describe('useUserMatches', () => {
  describe('mapMatchesToBenefitItems', () => {
    it('devuelve array vacío cuando matches es undefined', () => {
      expect(mapMatchesToBenefitItems(undefined)).toEqual([]);
    });

    it('devuelve array vacío cuando matches no es array', () => {
      expect(mapMatchesToBenefitItems(null as unknown as MatchResult[])).toEqual([]);
    });

    it('mapea un match con todos los campos al formato de la card', () => {
      const matches: MatchResult[] = [
        {
          benefit: {
            id: '1e265159-3628-477a-a558-05c5409aea01',
            name: 'Aporte Familiar Permanente (Ex Bono Marzo)',
            description: 'Monto de $61.793 por carga familiar o familia.',
            requirements: { cutoff_date: '2025-12-31' },
          },
          status: 'ELIGIBLE',
          missingRequirements: [],
        },
      ];

      const result = mapMatchesToBenefitItems(matches);

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Aporte Familiar Permanente (Ex Bono Marzo)');
      expect(result[0].amount).toBe(61793);
      expect(result[0].status).toBe('ELIGIBLE');
      expect(result[0].deadline).toMatch(/\d{1,2}/);
      expect(result[0].deadline).toMatch(/dic|diciembre/i);
      expect(result[0].deadline).toMatch(/2025/);
    });

    it('extrae monto de descripción con formato "Monto de $61.793"', () => {
      const matches: MatchResult[] = [
        {
          benefit: {
            id: 'x',
            name: 'Bono Test',
            description: 'Monto de $61.793 por carga.',
          },
          status: 'ELIGIBLE',
        },
      ];

      const result = mapMatchesToBenefitItems(matches);

      expect(result[0].amount).toBe(61793);
    });

    it('devuelve amount null cuando la descripción no tiene monto', () => {
      const matches: MatchResult[] = [
        {
          benefit: {
            id: 'x',
            name: 'Subsidio de Arriendo',
            description: 'Aporte mensual para pagar el arriendo.',
          },
          status: 'ELIGIBLE',
        },
      ];

      const result = mapMatchesToBenefitItems(matches);

      expect(result[0].amount).toBeNull();
      expect(result[0].title).toBe('Subsidio de Arriendo');
    });

    it('usa "Beneficio" cuando benefit.name falta o está vacío', () => {
      const matches: MatchResult[] = [
        {
          benefit: { id: 'x', name: '' },
          status: 'MISSING_DATA',
        },
      ];

      const result = mapMatchesToBenefitItems(matches);

      expect(result[0].title).toBe('Beneficio');
      expect(result[0].status).toBe('MISSING_DATA');
    });

    it('devuelve deadline "--" cuando no hay closesAt ni cutoff_date', () => {
      const matches: MatchResult[] = [
        {
          benefit: {
            id: 'x',
            name: 'Sin fecha',
            closesAt: null,
          },
          status: 'ELIGIBLE',
        },
      ];

      const result = mapMatchesToBenefitItems(matches);

      expect(result[0].deadline).toBe('--');
    });

    it('mapea status desconocido a MISSING_DATA', () => {
      const matches: MatchResult[] = [
        {
          benefit: { id: 'x', name: 'Otro' },
          status: 'UNKNOWN',
        },
      ];

      const result = mapMatchesToBenefitItems(matches);

      expect(result[0].status).toBe('MISSING_DATA');
    });

    it('mapea varios matches correctamente', () => {
      const matches: MatchResult[] = [
        {
          benefit: {
            id: '1',
            name: 'Bono A',
            description: 'Monto de $50.000.',
            requirements: { cutoff_date: '2025-06-30' },
          },
          status: 'ELIGIBLE',
        },
        {
          benefit: {
            id: '2',
            name: 'Bono B',
            description: 'Sin monto.',
          },
          status: 'MISSING_DATA',
        },
      ];

      const result = mapMatchesToBenefitItems(matches);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Bono A');
      expect(result[0].amount).toBe(50000);
      expect(result[0].status).toBe('ELIGIBLE');
      expect(result[1].title).toBe('Bono B');
      expect(result[1].amount).toBeNull();
      expect(result[1].status).toBe('MISSING_DATA');
    });
  });
});
