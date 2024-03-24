import { Person } from './person.model';

describe('Test for Person model', () => {
  let person: Person;

  beforeEach(() => {
    person = new Person('Diego', 'Gonzales', 28, 56, 1.7);
  });

  it('should have the necessary arguments', () => {
    expect(person.name).toBe('Diego');
    expect(person.lastname).toBeDefined();
    expect(person.age).toEqual(28);
  });

  describe('Test for "calculateIMC" method', () => {
    it('should return "Down"', () => {
      person.weight = 40;
      person.height = 1.65;

      const result = person.calculateIMC();

      expect(result).toBe('Down');
    });

    it('should return "Normal"', () => {
      const result = person.calculateIMC();

      expect(result).toBe('Normal');
    });
  });
});
