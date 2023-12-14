import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = '01-testing-services';

  ngOnInit(): void {
    const calculator = new Calculator();

    const result1 = calculator.multiply(3, 3);
    console.log(result1);

    const result2 = calculator.divide(3, 0);
    console.log(result2);
  }
}
