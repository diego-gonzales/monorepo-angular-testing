import { ComponentFixture, TestBed } from '@angular/core/testing';

import PersonComponent from './person.component';

fdescribe('PersonComponent', () => {
  let appComponent: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(appComponent).toBeTruthy();
  });

  it('should render a <p> with the text content "I am a paragraph"', () => {
    const text = 'I am a paragraph';
    const compiled = fixture.nativeElement as HTMLElement;
    const paragraph = compiled.querySelector('p');

    expect(paragraph?.textContent).toBe(text);
  });
});
