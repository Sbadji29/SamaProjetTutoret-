import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = 'bi-bar-chart';
  @Input() iconBgClass: 'icon-green' | 'icon-blue' | 'icon-success' | 'icon-gray' | 'icon-orange' | string = 'icon-green';
  @Input() valueClass: string = '';
  @Input() badgeText?: string;
  @Input() badgeClass: string = 'text-success fw-semibold';
  @Input() footerText?: string;
  @Input() progress?: number;
  @Input() progressClass: string = 'bg-success';
}
