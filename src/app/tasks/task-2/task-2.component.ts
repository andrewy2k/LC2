import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subject, takeUntil, } from "rxjs";
import { MessageService } from "../../services/message.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-task-2',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './task-2.component.html',
  styleUrl: './task-2.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task2Component implements OnInit, OnDestroy {
  public isStopped: boolean = false;

  private messageSubject$: Subject<string> = new Subject<string>();
  public message$: Observable<string> = this.messageSubject$.asObservable();

  private destroy$: Subject<void> = new Subject<void>();
  private messageBuffer: string[] = [];

  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.initMessageHandler();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initMessageHandler(): void {
    let isMessageShowingFromBuffer: boolean = false;
    this.messageService.messages$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((message) => {
      if (this.isStopped || this.messageBuffer.length !== 0) {
        this.messageBuffer.push(message);
        if (!this.isStopped && !isMessageShowingFromBuffer) {
          isMessageShowingFromBuffer = true;
          this.showMessageFromBuffer();
        }
      } else {
        isMessageShowingFromBuffer = false;
        this.messageSubject$.next(message);
      }
    });
  }

  private showMessageFromBuffer(): void {
    const stopInterval$: Subject<void> = new Subject<void>();
    interval(100).pipe(
      takeUntil(stopInterval$),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      if (this.messageBuffer.length > 0 && !this.isStopped) {
        this.messageSubject$.next(this.messageBuffer.shift() as string);
      } else {
        stopInterval$.next();
        stopInterval$.complete();
      }
    });
  }
}
