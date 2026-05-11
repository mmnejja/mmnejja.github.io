import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from './portfolio.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly portfolioService = inject(PortfolioService);
  protected readonly year = new Date().getFullYear();
}
