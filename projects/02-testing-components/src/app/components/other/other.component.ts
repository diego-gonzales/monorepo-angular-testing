import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '@directives/highlight.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReversePipe } from '@pipes/reverse.pipe';

@Component({
  selector: 'app-other',
  standalone: true,
  imports: [CommonModule, HighlightDirective, ReactiveFormsModule, ReversePipe],
  templateUrl: './other.component.html',
  styleUrl: './other.component.css',
})
export default class OtherComponent {
  inputColorControl = new FormControl('cyan', { nonNullable: true });
  inputTextControl = new FormControl('roma', { nonNullable: true });
}
