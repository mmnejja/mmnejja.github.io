import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly portfolioService = inject(PortfolioService);
}
