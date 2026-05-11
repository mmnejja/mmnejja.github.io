import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ContactForm, PortfolioService } from './portfolio.service';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

/**
 * ContactComponent
 *
 * Reactive contact form with:
 * - FormBuilder for clean form creation
 * - Granular field-level validation
 * - Accessible error messages linked via aria-describedby
 * - Loading + success + error states via Signals
 * - All submission logic delegated to PortfolioService
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RevealOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  protected readonly portfolioService = inject(PortfolioService);
  private readonly fb = inject(FormBuilder);

  protected readonly contactForm = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    file:    [''],
  });

  protected selectedFileName = '';

  protected readonly contactItems = [
    { icon: '✉️', label: 'Email',    value: 'hello@mohamedmnejja.dev',  href: 'mailto:hello@mohamedmnejja.dev' },
    { icon: '📍', label: 'Location', value: 'Tunisia',                   href: '#' },
    { icon: '🕒', label: 'Response', value: 'Within 24 hours',           href: '#' },
  ] as const;

  // ---- Computed helpers from service signal ----

  protected isSending() {
    return this.portfolioService.contactStatus() === 'sending';
  }

  protected statusMessage(): string {
    const status = this.portfolioService.contactStatus();
    if (status === 'success') return '✅ Message sent! I\'ll get back to you soon.';
    if (status === 'error')   return '❌ Something went wrong. Please try again.';
    return '';
  }

  protected statusClass(): string {
    const status = this.portfolioService.contactStatus();
    if (status === 'success') return 'success';
    if (status === 'error')   return 'error';
    return '';
  }

  // ---- Validation helpers ----

  protected isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control?.invalid && control.touched);
  }

  protected getError(field: string): string {
    const control = this.contactForm.get(field);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required'])   return `${this.fieldLabel(field)} is required.`;
    if (control.errors['email'])      return 'Please enter a valid email address.';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `${this.fieldLabel(field)} must be at least ${min} characters.`;
    }
    return 'Invalid value.';
  }

  private fieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      message: 'Message',
    };
    return labels[field] ?? field;
  }

  // ---- Submission ----

  protected onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = this.contactForm.getRawValue() as ContactForm;

    this.portfolioService.submitContact(formValue).subscribe((success) => {
      if (success) {
        this.contactForm.reset();
      }
    });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFileName = file?.name ?? '';
    this.contactForm.patchValue({ file: this.selectedFileName });
  }
}
