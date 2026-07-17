import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TaxesChartComponent } from '../../shared/taxes-chart/taxes-chart.component';

@Component({
  standalone: true,
  selector: 'app-dashboard-home',
  imports: [MatCardModule, TaxesChartComponent],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHomeComponent {}
