import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMealsComponent } from './manage-meals.component';

describe('ManageMealsComponent', () => {
  let component: ManageMealsComponent;
  let fixture: ComponentFixture<ManageMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
