import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Task4Component } from './task-4.component';

describe('Task4Component', () => {
  let component: Task4Component;
  let fixture: ComponentFixture<Task4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Task4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
