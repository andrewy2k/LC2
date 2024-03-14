import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable, scan, Subject, takeUntil } from "rxjs";
import { MessageService } from "../../services/message.service";
import { AsyncPipe, NgForOf } from "@angular/common";

@Component({
  selector: 'app-task-4',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './task-4.component.html',
  styleUrl: './task-4.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task4Component {
  public messages$: Observable<string[]> | undefined;

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
    this.messages$ = this.messageService.messages$.pipe(
      scan((acc: string[], curr: string) => {
        acc.push(curr);
        if (acc.length > 10) {
          acc.shift();
        }
        return acc;
      }, []),
      takeUntil(this.destroy$),
    );
  }
}
