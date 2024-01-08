import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-other',
  standalone: true,
  imports: [CommonModule, HighlightDirective, ReactiveFormsModule],
  templateUrl: './other.component.html',
  styleUrl: './other.component.css',
})
export default class OtherComponent {
  inputColorControl = new FormControl('#222', { nonNullable: true });
}
