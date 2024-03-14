import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { MessageService } from "../../services/message.service";
import { AsyncPipe, NgForOf } from "@angular/common";

@Component({
  selector: 'app-task-3',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
  ],
  templateUrl: './task-3.component.html',
  styleUrl: './task-3.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component implements OnInit, OnDestroy {
  private messageSubject$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public messages$: Observable<string[]> = this.messageSubject$.asObservable();

  private destroy$: Subject<void> = new Subject<void>();

  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.initMessageHandler();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initMessageHandler(): void {
    this.messageService.messages$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((message) => {
      this.messageSubject$.next([...this.messageSubject$.value, message]);
    });
  }
}
