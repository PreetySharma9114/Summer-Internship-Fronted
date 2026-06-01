import { CommonModule } from '@angular/common';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../shared/interfaces/user.interface';
import { UserRole } from '../../../auth/enums/user-role.enum';

@Component({
  selector: 'app-home',
  
  standalone: true,
  
  templateUrl: './home.page.html',
  imports: [CommonModule, IonContent, IonSpinner],
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);
  
  private destroyRef = inject(DestroyRef);
  
  user: User | null = null;
  
  loading = true;
  
  readonly userRole = UserRole;
  ngOnInit(): void {
    this.listenToUserState();
  }
  
 private listenToUserState(): void {
  this.authService.currentUser$
    .pipe(
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((user) => {
      this.user = user;
      this.loading = false;
    });
}
}
