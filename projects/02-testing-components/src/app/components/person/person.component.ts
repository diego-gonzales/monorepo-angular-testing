import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '@models/person.model';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css',
})
export default class PersonComponent {
  @Input({ required: true }) person: Person = new Person('', '', 0, 0, 0);
  imc = '';

  calculateIMC() {
    this.imc = this.person.calculateIMC();
  }
}
