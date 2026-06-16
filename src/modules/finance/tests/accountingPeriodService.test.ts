import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  closeAccountingPeriod,
  createAccountingPeriod,
  createFiscalYear,
  findAccountingPeriodByDate,
  isDateWithinAccountingPeriod,
  isPostingAllowed,
  lockAccountingPeriod
} from "../services/accountingPeriodService";

beforeEach(() => {
  vi.stubGlobal("crypto", {
    randomUUID: () => "period-1"
  });
});

describe("accountingPeriodService", () => {
  it("creates accounting period", () => {
    const period = createAccountingPeriod(
      " January 2026 ",
      "2026-01-01",
      "2026-01-31"
    );

    expect(period).toMatchObject({
      id: "period-1",
      name: "January 2026",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      status: "open"
    });

    expect(period?.createdAt).toBeTruthy();
  });

  it("blocks invalid accounting period", () => {
    expect(
      createAccountingPeriod(
        "",
        "2026-01-01",
        "2026-01-31"
      )
    ).toBeNull();

    expect(
      createAccountingPeriod(
        "January 2026",
        "2026-02-01",
        "2026-01-31"
      )
    ).toBeNull();
  });

  it("closes open accounting period", () => {
    const period = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    const closed = closeAccountingPeriod(
      period
    );

    expect(closed?.status).toBe("closed");
  });

  it("blocks closing non open period", () => {
    const period = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    const closed = closeAccountingPeriod(
      period
    )!;

    expect(
      closeAccountingPeriod(closed)
    ).toBeNull();
  });

  it("locks accounting period", () => {
    const period = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    const locked =
      lockAccountingPeriod(period);

    expect(locked?.status).toBe("locked");
  });

  it("blocks locking already locked period", () => {
    const period = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    const locked =
      lockAccountingPeriod(period)!;

    expect(
      lockAccountingPeriod(locked)
    ).toBeNull();
  });

  it("checks date inside accounting period", () => {
    const period = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    expect(
      isDateWithinAccountingPeriod(
        "2026-01-15",
        period
      )
    ).toBe(true);
  });

  it("checks date outside accounting period", () => {
    const period = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    expect(
      isDateWithinAccountingPeriod(
        "2026-02-01",
        period
      )
    ).toBe(false);
  });

  it("allows posting inside open period", () => {
    const period = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    expect(
      isPostingAllowed(
        "2026-01-15",
        [period]
      )
    ).toBe(true);
  });

  it("blocks posting inside closed period", () => {
    const period = closeAccountingPeriod(
      createAccountingPeriod(
        "January 2026",
        "2026-01-01",
        "2026-01-31"
      )!
    )!;

    expect(
      isPostingAllowed(
        "2026-01-15",
        [period]
      )
    ).toBe(false);
  });

  it("finds accounting period by date", () => {
    const january = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    const february = createAccountingPeriod(
      "February 2026",
      "2026-02-01",
      "2026-02-28"
    )!;

    const found =
      findAccountingPeriodByDate(
        "2026-02-15",
        [
          january,
          february
        ]
      );

    expect(found?.name).toBe(
      "February 2026"
    );
  });

  it("creates fiscal year", () => {
    const january = createAccountingPeriod(
      "January 2026",
      "2026-01-01",
      "2026-01-31"
    )!;

    const february = createAccountingPeriod(
      "February 2026",
      "2026-02-01",
      "2026-02-28"
    )!;

    const fiscalYear = createFiscalYear(
      2026,
      [
        february,
        january
      ]
    );

    expect(fiscalYear).toMatchObject({
      id: "period-1",
      year: 2026,
      startDate: "2026-01-01",
      endDate: "2026-02-28"
    });

    expect(fiscalYear?.periods[0].name).toBe(
      "January 2026"
    );
  });

  it("blocks fiscal year without periods", () => {
    expect(
      createFiscalYear(
        2026,
        []
      )
    ).toBeNull();
  });
});