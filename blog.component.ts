import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioService } from './portfolio.service';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [DatePipe, RevealOnScrollDirective],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  protected readonly portfolioService = inject(PortfolioService);
}
