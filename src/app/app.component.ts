import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageService } from './services/message.service';
import { Observable, Subject, takeUntil, timer } from "rxjs";
import { Task1Component } from "./tasks/task-1/task-1.component";
import { Task2Component } from "./tasks/task-2/task-2.component";
import { Task3Component } from "./tasks/task-3/task-3.component";
import { Task4Component } from "./tasks/task-4/task-4.component";
import { Task5Component } from "./tasks/task-5/task-5.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Task1Component, Task2Component, Task3Component, Task4Component, Task5Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  public isStoped: boolean = false;

  private messageSubject$: Subject<string> = new Subject<string>();
  public message$: Observable<string> = this.messageSubject$.asObservable();

  private messageBuffer: string[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public message: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.initMessage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showMessageFromBuffer(): void {
    const stopTimer$: Subject<void> = new Subject<void>();
    timer(100).pipe(
      takeUntil(stopTimer$),
    ).subscribe(() => {
      if (this.messageBuffer.length > 0 && !this.isStoped) {
        this.messageSubject$.next(this.messageBuffer.shift() as string);
      } else {
        stopTimer$.next();
        stopTimer$.complete();
      }
    });
  }

  private initMessage(): void {
    this.message.messages$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((message) => {
      if (this.isStoped || this.messageBuffer.length !== 0) {
        this.messageBuffer.push(message);
        if (!this.isStoped) {
          this.showMessageFromBuffer();
        }
      } else {
        this.messageSubject$.next(message);
      }
    });
  }
}
