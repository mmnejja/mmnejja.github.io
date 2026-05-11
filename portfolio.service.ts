import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, tap, finalize } from 'rxjs';

export type ContactStatus = 'idle' | 'sending' | 'success' | 'error';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface NavItem {
  label: string;
  fragment: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  icon: string;
  url: string;
}

export interface Skill {
  id: string;
  category: string;
  icon: string;
  items: Array<{ name: string; level: number }>;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: Date;
  readingTime: number;
  url: string;
  tags: string[];
}

export interface HighlightStat {
  label: string;
  value: string;
}

export interface ExperienceItem {
  period: string;
  title: string;
  summary: string;
}

/**
 * PortfolioService
 *
 * Single source of truth for all portfolio data.
 * Separates data concerns completely from components.
 *
 * - Static data (nav, socials) exposed as readonly arrays
 * - Dynamic data (projects, skills, blog) fetched and cached
 * - Contact form submission handled here
 * - Angular Signals used for reactive state management
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  // ---- Signals (reactive state) ----
  readonly contactStatus = signal<ContactStatus>('idle');
  readonly isDarkMode = signal<boolean>(this.loadThemePreference());

  // ---- Static data ----
  readonly navItems: readonly NavItem[] = [
    { label: 'Home', fragment: 'home' },
    { label: 'About',    fragment: 'about' },
    { label: 'Skills',   fragment: 'skills' },
    { label: 'Projects', fragment: 'projects' },
    { label: 'Blog',     fragment: 'blog' },
    { label: 'Contact',  fragment: 'contact' },
  ];

  readonly socialLinks: readonly SocialLink[] = [
    { platform: 'LinkedIn', label: 'LI', icon: 'LI', url: 'https://linkedin.com/' },
    { platform: 'GitHub', label: 'GH', icon: 'GH', url: 'https://github.com/' },
  ];

  readonly highlightStats: readonly HighlightStat[] = [
    { label: 'Big 4 Experience', value: 'PwC Alumni' },
    { label: 'Automation Projects', value: '25+' },
    { label: 'Tools Mastered', value: '30+' },
    { label: 'ESG Focus', value: 'CSRD Ready' },
  ];

  readonly experienceTimeline: readonly ExperienceItem[] = [
    {
      period: '2024 - Present',
      title: 'Audit, Data & AI Consultant',
      summary: 'Designing finance automation workflows, ESG reporting prototypes, and AI assistants for accounting teams.',
    },
    {
      period: '2022 - 2024',
      title: 'IT Audit & Risk - PwC',
      summary: 'Led ITGC assessments, process walkthroughs, and control testing across ERP and business-critical systems.',
    },
    {
      period: '2020 - 2022',
      title: 'Audit & Accounting Analyst',
      summary: 'Built reporting packs, reconciled financial controls, and improved closing cycle efficiency with BI dashboards.',
    },
  ];

  readonly skills: readonly Skill[] = [
    {
      id: 'audit-accounting',
      category: 'Audit & Accounting',
      icon: 'A',
      items: [
        { name: 'Financial Audit', level: 95 },
        { name: 'Internal Controls', level: 92 },
        { name: 'IFRS / Reporting', level: 88 },
      ],
    },
    {
      id: 'data-analytics',
      category: 'Data & Analytics',
      icon: 'D',
      items: [
        { name: 'Power BI', level: 93 },
        { name: 'Excel Modeling', level: 94 },
        { name: 'Python Analytics', level: 86 },
      ],
    },
    {
      id: 'erp-systems',
      category: 'ERP Systems',
      icon: 'E',
      items: [
        { name: 'SAP', level: 84 },
        { name: 'Odoo', level: 90 },
        { name: 'Dynamics 365', level: 80 },
      ],
    },
    {
      id: 'tech-automation',
      category: 'Tech & Automation',
      icon: 'T',
      items: [
        { name: 'n8n Workflows', level: 91 },
        { name: 'API Integrations', level: 87 },
        { name: 'AI Tools', level: 89 },
      ],
    },
  ];

  readonly projects: readonly Project[] = [
    {
      id: 'csrd-reporting-simulation',
      title: 'CSRD Reporting Simulation',
      description: 'Automated ESG data collection, validation, and report drafting pipeline for CSRD-style compliance workflows.',
      tags: ['n8n', 'ESG', 'CSRD', 'Automation'],
      liveUrl: '#',
      repoUrl: '#',
      featured: true,
    },
    {
      id: 'powerbi-financial-dashboard',
      title: 'Power BI Financial Dashboard',
      description: 'Executive-grade dashboard for profitability, cash flow, and budget variance with drill-through reporting.',
      tags: ['Power BI', 'DAX', 'Excel', 'Finance'],
      liveUrl: '#',
      repoUrl: '#',
      featured: true,
    },
    {
      id: 'ai-accounting-assistant',
      title: 'AI Accounting Assistant',
      description: 'Context-aware assistant to draft accounting responses, suggest entries, and answer policy-driven finance questions.',
      tags: ['Python', 'LLM', 'Prompt Engineering', 'RAG'],
      liveUrl: '#',
      repoUrl: '#',
      featured: true,
    },
    {
      id: 'chart-of-accounts-tool',
      title: 'Chart of Accounts Tool',
      description: 'Smart mapping and validation utility for ERP migrations with account normalization and exception tracking.',
      tags: ['ERP', 'SAP', 'Odoo', 'Data Quality'],
      liveUrl: '#',
      repoUrl: '#',
    },
  ];

  readonly blogPosts: readonly BlogPost[] = [
    {
      id: 'blog-audit-automation',
      title: 'How AI Is Reshaping Modern Audit Planning',
      excerpt: 'A practical framework to combine professional skepticism with automation in risk-based audit programs.',
      publishedAt: new Date('2026-02-12'),
      readingTime: 7,
      url: '#',
      tags: ['Audit', 'AI', 'Risk'],
    },
    {
      id: 'blog-csrd-control',
      title: 'CSRD Data Controls: From Spreadsheet Chaos to Governance',
      excerpt: 'Control points that improve ESG data reliability before disclosure cycles begin.',
      publishedAt: new Date('2026-01-05'),
      readingTime: 6,
      url: '#',
      tags: ['ESG', 'CSRD', 'Compliance'],
    },
    {
      id: 'blog-erp-finance',
      title: 'ERP Modernization Lessons for Finance Teams',
      excerpt: 'What finance leaders should prepare before SAP, Odoo, or Dynamics transformation projects.',
      publishedAt: new Date('2025-12-20'),
      readingTime: 9,
      url: '#',
      tags: ['ERP', 'Finance Transformation'],
    },
    {
      id: 'blog-powerbi-kpi',
      title: 'Designing KPI Dashboards That Drive Decisions',
      excerpt: 'A blueprint for Power BI dashboards that align controllers, CFOs, and operations teams.',
      publishedAt: new Date('2025-11-02'),
      readingTime: 5,
      url: '#',
      tags: ['Power BI', 'Analytics', 'Accounting'],
    },
  ];

  constructor(private readonly http: HttpClient) {
    document.body.classList.toggle('dark', this.isDarkMode());
  }

  // ---- Theme ----

  toggleTheme(): void {
    const next = !this.isDarkMode();
    this.isDarkMode.set(next);
    document.body.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  private loadThemePreference(): boolean {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // ---- Contact ----

  /**
   * Submit contact form.
   * Replace the `of(true)` mock with a real HttpClient call:
   *   return this.http.post('/api/contact', form).pipe(...)
   */
  submitContact(form: ContactForm): Observable<boolean> {
    this.contactStatus.set('sending');

    // ---- Replace with real API call ----
    // return this.http.post<void>('/api/contact', form).pipe(...)
    return of(true).pipe(
      tap(() => this.contactStatus.set('success')),
      catchError(() => {
        this.contactStatus.set('error');
        return of(false);
      }),
      finalize(() => {
        // Auto-reset status after 5 seconds
        setTimeout(() => this.contactStatus.set('idle'), 5000);
      })
    );
  }
}
