import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span>Business Management System</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.getCurrentUser() | async as user">
        <button mat-button routerLink="/inventory">Inventory</button>
        <button mat-button routerLink="/sales">Sales</button>
        <button mat-button routerLink="/accounting">Accounting</button>
        <button mat-button (click)="authService.signOut()">Sign Out</button>
      </ng-container>
    </mat-toolbar>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
    }
  `]
})
export class App {
  constructor(public authService: AuthService) {}
}