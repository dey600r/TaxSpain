import { Injectable } from '@angular/core';

export type YearTab = {
  id: string;
  year: number;
};

const YEAR_TABS_STORAGE_KEY = 'year-tabs-state';

@Injectable({
  providedIn: 'root'
})
export class YearTabsService {
  private readonly monthKeyPrefix = 'month-tab-state';
  private readonly summaryKeyPrefix = 'irpf-summary-state';

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  createDefaultTabs(): YearTab[] {
    return [
      {
        id: this.generateTabId(),
        year: this.getCurrentYear()
      }
    ];
  }

  loadTabs(): YearTab[] {
    if (!this.isBrowser()) {
      return this.createDefaultTabs();
    }

    try {
      const saved = window.localStorage.getItem(YEAR_TABS_STORAGE_KEY);
      if (!saved) {
        return this.createDefaultTabs();
      }

      const parsed = JSON.parse(saved) as { tabs?: Array<Partial<YearTab>> };
      const tabs = (parsed.tabs ?? [])
        .map(tab => ({
          id: tab.id ? String(tab.id) : this.generateTabId(),
          year: this.normalizeYear(tab.year)
        }))
        .filter(tab => tab.year > 0);

      return tabs.length ? tabs : this.createDefaultTabs();
    } catch {
      return this.createDefaultTabs();
    }
  }

  saveTabs(tabs: YearTab[]): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      window.localStorage.setItem(YEAR_TABS_STORAGE_KEY, JSON.stringify({ tabs }));
    } catch {
      // ignore storage errors
    }
  }

  getMonthStorageKey(year: number, monthName: string): string {
    return `${this.monthKeyPrefix}-${year}-${monthName}`;
  }

  getSummaryStorageKey(year: number): string {
    return `${this.summaryKeyPrefix}-${year}`;
  }

  cloneYearData(sourceYear: number, targetYear: number, months: string[]): void {
    if (!this.isBrowser() || sourceYear === targetYear) {
      return;
    }

    months.forEach(month => {
      const sourceKey = this.getMonthStorageKey(sourceYear, month);
      const targetKey = this.getMonthStorageKey(targetYear, month);
      const saved = window.localStorage.getItem(sourceKey);
      if (saved) {
        window.localStorage.setItem(targetKey, saved);
      }
    });

    const sourceSummaryKey = this.getSummaryStorageKey(sourceYear);
    const targetSummaryKey = this.getSummaryStorageKey(targetYear);
    const summarySaved = window.localStorage.getItem(sourceSummaryKey);
    if (summarySaved) {
      window.localStorage.setItem(targetSummaryKey, summarySaved);
    }
  }

  normalizeYear(value: unknown, fallback = this.getCurrentYear()): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    const integer = Math.trunc(parsed);
    if (integer < 0) {
      return fallback;
    }

    return integer;
  }

  private generateTabId(): string {
    return `year-tab-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}