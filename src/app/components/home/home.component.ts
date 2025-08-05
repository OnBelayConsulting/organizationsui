import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule]
})
export class HomeComponent implements OnDestroy {
  private copyMessageSubject = new BehaviorSubject<string | null>(null);

  ngOnDestroy(): void {
    this.copyMessageSubject.complete();
  }
}
