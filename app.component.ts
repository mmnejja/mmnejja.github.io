import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavComponent } from './nav.component';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { SkillsComponent } from './skills.component';
import { ProjectsComponent } from './projects.component';
import { BlogComponent } from './blog.component';
import { ContactComponent } from './contact.component';
import { FooterComponent } from './footer.component';

/**
 * AppComponent
 *
 * Root shell for this standalone demo.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    HomeComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    BlogComponent,
    ContactComponent,
    FooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
