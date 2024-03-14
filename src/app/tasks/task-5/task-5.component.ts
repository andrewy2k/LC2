import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf } from "@angular/common";
import { interval, Observable, scan, Subject, takeUntil } from "rxjs";
import { MessageService } from "../../services/message.service";

@Component({
  selector: 'app-task-5',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './task-5.component.html',
  styleUrl: './task-5.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Task5Component {
  public isStopped: boolean = false;

  private messageSubject$: Subject<string> = new Subject<string>();
  public messages$: Observable<string[]> | undefined;

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
    this.messages$  = this.messageSubject$.asObservable().pipe(
      scan((acc: string[], curr: string) => {
        acc.push(curr);
        if (acc.length > 10) {
          acc.shift();
        }
        return acc;
      }, []),
    );

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
