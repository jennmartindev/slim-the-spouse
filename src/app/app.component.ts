import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AuthComponent, MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly supabase = inject(SupabaseService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  title = 'Plump The Pops';

  session = this.supabase.session;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && !this.supabase.session) {
      this.supabase.authChanges((_, session) => (this.session = session));
    }
  }

  goHome() {
    this.router.navigate(['']);
  }

  logout() {
    this.supabase.signOut();
  }

  manageMeals = () => this.router.navigate(['manage-meals']);

  calorieLookup = () => window.open('https://www.nutritionix.com', '_blank');
}
