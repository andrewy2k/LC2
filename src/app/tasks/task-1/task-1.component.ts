import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from "../../services/message.service";
import { NEVER, Observable, of, Subject, switchMap, takeUntil } from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-task-1',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  templateUrl: './task-1.component.html',
  styleUrl: './task-1.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task1Component implements OnInit, OnDestroy {
  public isStopped: boolean = false;
  public message$: Observable<string> | undefined;

  private destroy$: Subject<void> = new Subject<void>();

  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.message$ = this.messageService.messages$.pipe(
      switchMap((message) => {
          return this.isStopped ? NEVER : of(message);
        }
      ),
      takeUntil(this.destroy$),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
