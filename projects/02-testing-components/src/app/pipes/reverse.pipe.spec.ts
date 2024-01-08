import { ReversePipe } from './reverse.pipe';

fdescribe('ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform "perro" to "orrep"', () => {
    const reversePipe = new ReversePipe();
    expect(reversePipe.transform('perro')).toBe('orrep');
  });
});
