import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeInputsComponent } from './attribute-inputs.component';

describe('AttributeInputsComponent', () => {
  let component: AttributeInputsComponent;
  let fixture: ComponentFixture<AttributeInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeInputsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
