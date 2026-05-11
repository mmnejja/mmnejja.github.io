import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { PortfolioService } from './portfolio.service';

/**
 * NavComponent
 *
 * Sticky top navigation with:
 * - Responsive hamburger menu
 * - Active section highlighting via IntersectionObserver
 * - Dark / light mode toggle
 * - Fully keyboard accessible
 */
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements AfterViewInit {
  protected readonly portfolioService = inject(PortfolioService);
  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('home');

  ngAfterViewInit(): void {
    this.updateActiveSection();
  }

  @HostListener('window:scroll')
  protected updateActiveSection(): void {
    const sections = this.portfolioService.navItems.map((item) => item.fragment);
    const viewportOffset = 140;

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (!element) {
        continue;
      }

      const rect = element.getBoundingClientRect();
      if (rect.top <= viewportOffset && rect.bottom > viewportOffset) {
        this.activeSection.set(sectionId);
        break;
      }
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open: boolean) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected isActive(fragment: string): boolean {
    return this.activeSection() === fragment;
  }
}
