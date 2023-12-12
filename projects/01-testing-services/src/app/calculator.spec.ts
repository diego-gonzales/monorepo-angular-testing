import { Calculator } from './calculator';

fdescribe('Calculator', () => {
  it('#multiply method should return 9', () => {
    // Arrange
    const calculator = new Calculator();
    // Act
    const result = calculator.multiply(3, 3);
    // Assert
    expect(result).toBe(9);
  });

  it('#divide method should return some numbers', () => {
    const calculator = new Calculator();
    const result1 = calculator.divide(6, 3);
    expect(result1).toEqual(2);

    const result2 = calculator.divide(5, 2);
    expect(result2).toEqual(2.5);
  });

  it('#divide method should return null', () => {
    const calculator = new Calculator();
    const result = calculator.divide(5, 0);
    expect(result).toBeNull();
  });

  it('testing matchers', () => {
    const name1 = 'Diego';
    let name2;

    expect(name1).toBeDefined();
    expect(name2).toBeUndefined();

    expect(1 + 3 === 4).toBeTruthy();
    expect(1 + 1 === 3).toBeFalsy();

    expect(5).toBeLessThan(10);
    expect(20).toBeGreaterThan(10);

    expect('123456').toMatch(/123/);

    expect(['apples', 'oranges', 'pears']).toContain('oranges');
  });
});
