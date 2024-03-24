import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[highlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input('highlight') bgColor = '';
  defaultColor = 'gray';

  constructor(private _hostElement: ElementRef<HTMLElement>) {
    _hostElement.nativeElement.style.backgroundColor = this.defaultColor;
  }

  ngOnChanges(): void {
    this._hostElement.nativeElement.style.backgroundColor =
      this.bgColor || this.defaultColor;
  }
}
