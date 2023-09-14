import { Calculator } from "./calculator";

describe('Tests for Calculator', () => {
  describe('Test for multiply', () => {
    it('should return nine', () => {
      // Arrange (preparar)
      const calculator = new Calculator();
      // Act
      const result = calculator.multiply(3, 3);
      // Assert
      expect(result).toEqual(9);
    });
    it('should return four', () => {
      const calculator = new Calculator();
      const result = calculator.multiply(1, 4);
      expect(result).toEqual(4);
    });
  });

  describe('Tests for divide', () => {
    it('should return some numbers', () => {
      const calculator = new Calculator();
      expect(calculator.divide(6, 3)).toEqual(2);
      expect(calculator.divide(5, 2)).toEqual(2.5);
    });
    it('should return null', () => {
      const calculator = new Calculator();
      expect(calculator.divide(6, 0)).toBeNull();
      expect(calculator.divide(6, 0)).toBeNull();
      expect(calculator.divide(5983722441673, 0)).toBeNull();
    });
  });

  describe('Tests examples', () => {
    it('Test matchers', () => {
      let name = 'Gerson';
      let name2;

      expect(name).toBeDefined();
      expect(name2).toBeUndefined();

      expect(1 + 3 === 4).toBeTruthy();
      expect(1 + 1 === 3).toBeFalsy();

      expect(5).toBeLessThan(10);
      expect(20).toBeGreaterThan(10);

      expect('12345').toMatch(/123/);
      expect(['apples', 'oranges', 'pears']).toContain('pears');
    });
  });

});
