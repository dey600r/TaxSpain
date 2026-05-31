import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MonthTabComponent } from '../../shared/month-tab/month-tab';
import { IrpfSummaryTabComponent } from '../../shared/irpf-summary-tab/irpf-summary-tab';
import { TAX_CONSTANTS } from '../../core/utils/constants';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  host: {
    'ngSkipHydration': ''
  },
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MonthTabComponent,
    IrpfSummaryTabComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  year = 2026;
  months = TAX_CONSTANTS.MONTHS;
}
