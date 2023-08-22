import { dateTime } from './date-time.helper';

describe('dateTimeHelper', () => {
  beforeAll(() => {
    jest.useFakeTimers({ advanceTimers: true });
    jest.setSystemTime(new Date('2022-03-08T00:00:00.000Z').valueOf());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('#buildDateRange', () => {
    const DATES = {
      START: '2022-03-01',
      END: '2022-03-31',
      FORMAT: 'y-LL-dd',
    };

    it('build bound closed interval', () => {
      const dateRange = dateTime.buildDateRange(DATES.START, DATES.END, { format: DATES.FORMAT });
      expect(dateRange).toEqual('[2022-03-01,2022-03-31)');
    });

    it('build lowered bound opened interval', () => {
      const dateRange = dateTime.buildDateRange(null, DATES.END, { format: DATES.FORMAT });
      expect(dateRange).toEqual('[,2022-03-31)');
    });

    it('build upper bound opened interval', () => {
      const dateRange = dateTime.buildDateRange(DATES.START, null, { format: DATES.FORMAT });
      expect(dateRange).toEqual('[2022-03-01,)');
    });

    it('should throw due to it impossible to create both bound opened interval', () => {
      expect(() => dateTime.buildDateRange(null, null, { format: DATES.FORMAT })).toThrow(
        "Can't create date range that have both bounds opened",
      );
    });
  });
});
