import { ComponentFixture, TestBed } from '@angular/core/testing';

import PeopleComponent from './people.component';
import PersonComponent from '@components/person/person.component';
import { Person } from '@models/person.model';
import { By } from '@angular/platform-browser';

describe('PeopleComponent', () => {
  let peopleComponent: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleComponent, PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    peopleComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(peopleComponent).toBeTruthy();
  });

  it('should have a list of people', () => {
    const totalPeople = peopleComponent.people.length;
    const compiled = fixture.nativeElement as HTMLElement;
    const list = compiled.querySelectorAll('app-person');

    expect(list.length).toBe(totalPeople);
  });

  it('should have a list of people - with "debugElement"', () => {
    peopleComponent.people = [
      new Person('Test 1', 'Lastname 1', 15, 30, 50),
      new Person('Test 2', 'Lastname 2', 18, 36, 58),
    ];

    fixture.detectChanges();

    const listDebug = fixture.debugElement.queryAll(By.css('app-person'));

    expect(listDebug.length).toBe(peopleComponent.people.length);
  });

  it('should emit the first person when we click on "Emit Person"', () => {
    const buttonDebug = fixture.debugElement.query(By.css('button.btn-emit'));

    buttonDebug.triggerEventHandler('click');

    expect(peopleComponent.selectedPerson).toEqual(peopleComponent.people[0]);
  });

  it('should render the selected person when we click on "Emit Person"', () => {
    const buttonDebug = fixture.debugElement.query(By.css('button.btn-emit'));

    buttonDebug.triggerEventHandler('click');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const h3 = compiled.querySelector('h3');
    const h4 = compiled.querySelector('h4');
    const li = compiled.querySelector('li');

    expect(h3?.textContent).toContain(peopleComponent.selectedPerson?.name);
    expect(h4?.textContent).toContain(peopleComponent.people.length);
    expect(li?.textContent).toContain(peopleComponent.selectedPerson?.name);
  });
});
