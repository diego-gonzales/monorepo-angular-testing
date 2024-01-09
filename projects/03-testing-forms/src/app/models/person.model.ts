export class Person {
  constructor(
    public name: string,
    public lastname: string,
    public age: number,
    public weight: number,
    public height: number,
  ) {}

  calculateIMC(): string {
    const imc = Math.round(this.weight / (this.height * this.height));

    if (imc >= 0 && imc <= 18) return 'Down';
    else if (imc >= 19 && imc <= 24) return 'Normal';
    else if (imc >= 25 && imc <= 26) return 'Overweight';
    else if (imc >= 27 && imc <= 29) return 'Overweight Level 1';
    else if (imc >= 30 && imc <= 39) return 'Overweight Level 2';
    else if (imc === 40) return 'Overweight Level 3';
    else return 'Invalid IMC';
  }
}
