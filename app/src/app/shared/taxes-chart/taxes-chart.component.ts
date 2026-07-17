import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DashboardChartService, YearChartData } from '../../core/services/dashboard-chart.service';

interface ChartDimensions {
  width: number;
  height: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
}

interface ChartBar {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  color: string;
  label: string;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
}

@Component({
  standalone: true,
  selector: 'app-taxes-chart',
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="taxes-chart-card">
      <mat-card-header>
        <mat-card-title>Impuestos por año</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="!hasData" class="no-data">
          No hay datos registrados.
        </div>
        <div *ngIf="hasData" class="chart-container">
          <svg [attr.viewBox]="svgViewBox" preserveAspectRatio="xMidYMid meet" class="chart-svg">
            <!-- Ejes -->
            <line [attr.x1]="chartDim.marginLeft" [attr.y1]="chartDim.height - chartDim.marginBottom"
                  [attr.x2]="chartDim.width - chartDim.marginRight" [attr.y2]="chartDim.height - chartDim.marginBottom"
                  stroke="var(--mat-sys-outline)" stroke-width="1" />
            <line [attr.x1]="chartDim.marginLeft" [attr.y1]="chartDim.marginTop"
                  [attr.x2]="chartDim.marginLeft" [attr.y2]="chartDim.height - chartDim.marginBottom"
                  stroke="var(--mat-sys-outline)" stroke-width="1" />

            <!-- Barras -->
            <rect *ngFor="let bar of chartBars"
                  [attr.x]="bar.x" [attr.y]="bar.y"
                  [attr.width]="bar.width" [attr.height]="bar.height"
                  [attr.fill]="bar.color" opacity="0.85" />

            <!-- Línea de Salario Bruto -->
            <polyline [attr.points]="linePoints"
                      fill="none" stroke="var(--mat-sys-on-surface)" stroke-width="2" />
            <circle *ngFor="let point of chartLinePoints"
                    [attr.cx]="point.x" [attr.cy]="point.y"
                    r="3" fill="var(--mat-sys-on-surface)" />

            <!-- Etiquetas X (años) -->
            <text *ngFor="let label of xAxisLabels"
                  [attr.x]="label.x" [attr.y]="chartDim.height - chartDim.marginBottom + 20"
                  text-anchor="middle" font-size="12" fill="var(--mat-sys-on-surface)">
              {{ label.year }}
            </text>

            <!-- Etiquetas Y (valores) -->
            <text *ngFor="let label of yAxisLabels"
                  [attr.x]="chartDim.marginLeft - 5" [attr.y]="label.y + 4"
                  text-anchor="end" font-size="11" fill="var(--mat-sys-on-surface)">
              {{ label.text }}
            </text>
          </svg>

          <!-- Leyenda -->
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: var(--mat-sys-error)"></div>
              <span>Retención IRPF</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: var(--mat-sys-tertiary)"></div>
              <span>Retención Capital</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: var(--mat-sys-secondary)"></div>
              <span>SS Empleado</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: var(--mat-sys-primary)"></div>
              <span>SS Empresa</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: var(--mat-sys-on-surface); height: 2px; top: 8px;"></div>
              <span>Salario Bruto</span>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .taxes-chart-card {
      width: 100%;
    }

    .no-data {
      padding: 40px 20px;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }

    .chart-container {
      padding: 20px;
    }

    .chart-svg {
      width: 100%;
      height: auto;
      min-height: 400px;
      margin-bottom: 20px;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--mat-sys-outline-variant);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      position: relative;
    }
  `]
})
export class TaxesChartComponent implements OnInit {
  data: YearChartData[] = [];
  hasData = false;

  chartBars: ChartBar[] = [];
  chartLinePoints: ChartPoint[] = [];
  linePoints = '';
  xAxisLabels: Array<{ x: number; year: number }> = [];
  yAxisLabels: Array<{ y: number; text: string }> = [];

  svgViewBox = '0 0 1200 500';

  chartDim: ChartDimensions = {
    width: 1200,
    height: 500,
    marginLeft: 60,
    marginRight: 40,
    marginTop: 20,
    marginBottom: 60
  };

  private readonly barColors = {
    irpf: 'var(--mat-sys-error)',
    capital: 'var(--mat-sys-tertiary)',
    ssEmpleado: 'var(--mat-sys-secondary)',
    ssEmpresa: 'var(--mat-sys-primary)'
  };

  constructor(private dashboardChartService: DashboardChartService) {}

  ngOnInit(): void {
    this.loadAndRenderChart();
  }

  private loadAndRenderChart(): void {
    this.data = this.dashboardChartService.getYearsChartData();
    this.hasData = this.data.length > 0;

    if (this.hasData) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    const plotWidth = this.chartDim.width - this.chartDim.marginLeft - this.chartDim.marginRight;
    const plotHeight = this.chartDim.height - this.chartDim.marginTop - this.chartDim.marginBottom;

    // Calcular escala Y
    const maxValue = Math.max(...this.data.map(d =>
      Math.max(d.retencionIrpf + d.retencionCapital + d.ssEmpleado + d.ssEmpresa, d.salarioBruto)
    ));
    const yMax = maxValue * 1.1; // 10% margin
    const yScale = plotHeight / yMax;

    // Calcular posiciones X
    const groupSpacing = plotWidth / this.data.length;
    const barWidth = Math.min(15, groupSpacing / 5);
    const groupWidth = barWidth * 4.5;

    this.chartBars = [];
    this.xAxisLabels = [];
    this.chartLinePoints = [];

    this.data.forEach((yearData, yearIndex) => {
      const groupCenterX = this.chartDim.marginLeft + (yearIndex + 0.5) * groupSpacing;
      const baseX = groupCenterX - groupWidth / 2;

      // X axis label
      this.xAxisLabels.push({ x: groupCenterX, year: yearData.year });

      // Barras
      const bars = [
        { value: yearData.retencionIrpf, color: this.barColors.irpf, label: 'IRPF' },
        { value: yearData.retencionCapital, color: this.barColors.capital, label: 'Capital' },
        { value: yearData.ssEmpleado, color: this.barColors.ssEmpleado, label: 'SS Empleado' },
        { value: yearData.ssEmpresa, color: this.barColors.ssEmpresa, label: 'SS Empresa' }
      ];

      let cumulativeValue = 0;
      bars.forEach((bar, barIndex) => {
        const x = baseX + barIndex * (barWidth + 2);
        const barHeight = bar.value * yScale;
        const y = this.chartDim.height - this.chartDim.marginBottom - barHeight;

        this.chartBars.push({
          x,
          y,
          width: barWidth,
          height: barHeight,
          value: bar.value,
          color: bar.color,
          label: bar.label
        });

        cumulativeValue += bar.value;
      });

      // Punto de línea (salario bruto)
      const lineY = this.chartDim.height - this.chartDim.marginBottom - (yearData.salarioBruto * yScale);
      this.chartLinePoints.push({
        x: groupCenterX,
        y: lineY,
        value: yearData.salarioBruto
      });
    });

    // Generar polyline para la línea
    this.linePoints = this.chartLinePoints.map(p => `${p.x},${p.y}`).join(' ');

    // Generar etiquetas Y (cada 1000 o proporcional)
    this.yAxisLabels = [];
    const step = this.calculateYAxisStep(yMax);
    for (let i = 0; i <= yMax; i += step) {
      const y = this.chartDim.height - this.chartDim.marginBottom - (i * yScale);
      const text = i === 0 ? '0' : (i / 1000).toFixed(1) + 'k';
      this.yAxisLabels.push({ y, text });
    }
  }

  private calculateYAxisStep(maxValue: number): number {
    if (maxValue <= 5000) return 500;
    if (maxValue <= 10000) return 1000;
    if (maxValue <= 50000) return 5000;
    if (maxValue <= 100000) return 10000;
    return 20000;
  }
}
