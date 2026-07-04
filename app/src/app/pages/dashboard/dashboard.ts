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
import { YearTab, YearTabsService } from '../../core/services/year-tabs.service';

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
  months = TAX_CONSTANTS.MONTHS;

  yearTabs: YearTab[] = [];
  activeYearTabId = '';
  editingYearTabId = '';
  pendingYearValue = '';

  constructor(private yearTabsService: YearTabsService) {
    this.yearTabs = this.sortYearTabs(this.yearTabsService.loadTabs());
    this.activeYearTabId = this.yearTabs[0]?.id ?? '';
    this.yearTabsService.saveTabs(this.yearTabs);
  }

  get activeYear(): number {
    return this.activeYearTab?.year ?? this.yearTabsService.getCurrentYear();
  }

  get activeYearTab(): YearTab | undefined {
    return this.yearTabs.find(tab => tab.id === this.activeYearTabId);
  }

  setActiveTab(tabId: string): void {
    this.activeYearTabId = tabId;
    this.cancelEditYear();
  }

  addYearFromActive(): void {
    const activeTab = this.activeYearTab;
    const sourceYear = activeTab?.year ?? this.yearTabsService.getCurrentYear();
    const nextYear = this.getNextAvailableYear(sourceYear);

    const newTab: YearTab = {
      id: `year-tab-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      year: nextYear
    };

    this.yearTabsService.cloneYearData(sourceYear, newTab.year, this.months);
    this.yearTabs = this.sortYearTabs([...this.yearTabs, newTab]);
    this.activeYearTabId = newTab.id;
    this.yearTabsService.saveTabs(this.yearTabs);
  }

  startEditYear(tab: YearTab): void {
    this.editingYearTabId = tab.id;
    this.pendingYearValue = String(tab.year);
  }

  onYearInput(value: string): void {
    this.pendingYearValue = value.replace(/\D+/g, '').slice(0, 4);
  }

  saveEditedYear(tab: YearTab): void {
    if (this.editingYearTabId !== tab.id) {
      return;
    }

    const trimmed = this.pendingYearValue.trim();
    if (!/^\d{4}$/.test(trimmed)) {
      this.cancelEditYear();
      return;
    }

    const nextYear = Number(trimmed);
    const duplicated = this.yearTabs.some(item => item.id !== tab.id && item.year === nextYear);
    if (duplicated) {
      this.cancelEditYear();
      return;
    }

    if (nextYear !== tab.year) {
      this.yearTabsService.cloneYearData(tab.year, nextYear, this.months);
      this.yearTabs = this.sortYearTabs(
        this.yearTabs.map(item => item.id === tab.id ? { ...item, year: nextYear } : item)
      );
      this.yearTabsService.saveTabs(this.yearTabs);
    }

    this.cancelEditYear();
  }

  cancelEditYear(): void {
    this.editingYearTabId = '';
    this.pendingYearValue = '';
  }

  removeYearTab(tab: YearTab): void {
    if (this.yearTabs.length <= 1) {
      return;
    }

    const index = this.yearTabs.findIndex(item => item.id === tab.id);
    if (index < 0) {
      return;
    }

    const tabs = this.yearTabs.filter(item => item.id !== tab.id);
    this.yearTabs = tabs;

    if (this.activeYearTabId === tab.id) {
      const fallback = tabs[index] ?? tabs[index - 1] ?? tabs[0];
      this.activeYearTabId = fallback?.id ?? '';
    }

    if (this.editingYearTabId === tab.id) {
      this.cancelEditYear();
    }

    this.yearTabsService.saveTabs(this.yearTabs);
  }

  private sortYearTabs(tabs: YearTab[]): YearTab[] {
    return [...tabs].sort((a, b) => a.year - b.year);
  }

  private getNextAvailableYear(startingYear: number): number {
    const usedYears = new Set(this.yearTabs.map(tab => tab.year));
    let candidate = this.yearTabsService.normalizeYear(startingYear + 1, this.yearTabsService.getCurrentYear());

    while (usedYears.has(candidate)) {
      candidate += 1;
    }

    return candidate;
  }
}
