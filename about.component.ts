import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly portfolioService = inject(PortfolioService);
}
