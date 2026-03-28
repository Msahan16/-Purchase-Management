import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar no-print">
      <div class="nav-container">
        <div class="brand">
          <div class="logo-box">EP</div>
          <h1 class="logo-text">ERP-Purchase</h1>
        </div>
        <ul class="nav-links">
          <li>
            <a routerLink="/purchase-list" routerLinkActive="active" class="nav-link">
              <span class="icon">📋</span> Bills
            </a>
          </li>
          <li>
            <a routerLink="/purchase-add" routerLinkActive="active" class="nav-link">
              <span class="icon">➕</span> Create Bill
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <main class="page-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: var(--primary);
      color: white;
      height: 72px;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
    }
    .nav-container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-box {
      background: var(--accent);
      color: white;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: 800;
      font-size: 14px;
    }
    .logo-text {
      color: white;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 8px;
    }
    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-link:hover {
      color: white;
      background: rgba(255,255,255,0.05);
    }
    .nav-link.active {
      color: white;
      background: rgba(255,255,255,0.1);
    }
    .icon {
      font-size: 14px;
    }
    .page-content {
      padding-top: 1rem;
    }
  `]
})
export class AppComponent {}
