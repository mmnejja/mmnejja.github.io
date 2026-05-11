import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  protected readonly portfolioService = inject(PortfolioService);
}
