import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import PersonComponent from '@components/person/person.component';
import { Person } from '@models/person.model';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule, PersonComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.css',
})
export default class PeopleComponent {
  person = new Person('Harry', 'Potter', 18, 70, 1.65);
}
