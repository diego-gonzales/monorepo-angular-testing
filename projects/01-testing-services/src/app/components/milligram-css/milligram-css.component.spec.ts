import { ComponentFixture, TestBed } from '@angular/core/testing';

import MilligramCssComponent from './milligram-css.component';

xdescribe('MilligramCssComponent', () => {
  let component: MilligramCssComponent;
  let fixture: ComponentFixture<MilligramCssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilligramCssComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilligramCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
