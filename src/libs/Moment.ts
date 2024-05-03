import moment from 'moment';
import { ApiError } from '../ApiError';

moment.locale('ru');

class Moment {
  private typesOfTime: {
    [key: string]: string;
  };

  constructor() {
    this.typesOfTime = {
      year: 'year',
      month: 'month',
      quarter: 'quarter',
      week: 'isoWeek',
      day: 'day',
    };
  }

   /**
   * Возвращает timestamp начала текущего дня
   * @returns {number} timestamp начала текущего дня
   */
  getTodayTimestamp(): number {
    return moment().startOf('day').valueOf();
  }

    /**
   * Возвращает timestamp начала вчерашнего дня
   * @returns {number} timestamp начала вчерашнего дня
   */
  getYesterdayTimestamp(): number {
    return moment().subtract(1, 'day').startOf('day').valueOf();
  }

  /**
   * Возвращает timestamp начала прошлой недели
   * @returns {number} timestamp начала прошлой недели
   */
  getLastWeekdayTimestamp(): number {
    return moment().subtract(7, 'days').startOf('week').valueOf();
  }

   /**
   * Преобразует дату в формат "YYYY-MM-DD"
   * @param {string} date - Дата в формате "DD.MM.YYYY" | "DD.MM.YYYYTHH:mm:ssZ"
   * @returns {string} Дата в формате "YYYY-MM-DD"
   */
  reverseToSplash(date: string): string {
    return moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD');
  }

   /**
   * Преобразует дату в формат "DD.MM.YYYY"
   * @param {string} date - Дата в формате "YYYY-MM-DD" | "YYYY-MM-DDTHH:mm:ssZ"
   * @returns {string} Дата в формате "DD.MM.YYYY"
   */
  reverseToDotted(date: string): string {
    return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
  }

   /**
   * Получаем точный timestamp даты
   * (используем только, когда нужен timestamp с секундами) иначе используем метод startDate
   * @param {!string} date - Дата в формате передаваемой маски.
   * @param {string} [mask=undefined] - Формат маски на входе. Например: "2024-01-01T21:12:18Z". (optional)
   * @param {string} [format=x] - Формат маски на выходе. Default: "x". (optional)
   * @returns {string} Дата в формате "x"
   * @example
   * convertDateToTimestamp("2024-01-01")  // 1704056400000
   * convertDateToTimestamp("2024-01-01T12:00:00", "YYYY-MM-DDTHH:mm:ss", "x")  // 1704099600000
   */
  convertDateToTimestamp(date: string, mask: string | undefined = undefined, format: string = 'x'): string {
    return moment(date, mask).format(format);
  }

    /**
   * Преобразует timestamp в нужный формат даты. Default: 'YYYY-MM-DD'
   * @param {!string|number} date - Timestamp даты.
   * @param {string} [mask=x] - Формат маски на входе. Например: "x" | "X". (optional)
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD". (optional)
   * @returns {string} Дата в формате "YYYY-MM-DD"
   */
  convertTimestampToDate(date: string | number, mask: string ='x', format: string = 'YYYY-MM-DD'): string {
    return moment(date, mask).format(format);
  }

   /**
   * Преобразует текущую дату в нужный формат. Default: 'YYYY-MM-DD'
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Defaults: "YYYY-MM-DD". (optional)
   * @returns {string} Дата в формате "YYYY-MM-DD"
   */
  formatCurrentDate(format: string = 'YYYY-MM-DD'): string {
    return moment().format(format);
  }

    /**
   * Преобразует входящую дату в нужный формат. Default: 'YYYY-MM-DD'
   * @param {!string|number} date - Дата в формате передаваемой маски.
   * @param {!string} mask - Формат маски на входе. (required)
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Defaults: "YYYY-MM-DD". (optional)
   * @returns {string} The formatted date.
   */
  formatDateTo(date: string | number, mask: string, format: string = 'YYYY-MM-DD'): string {
    return moment(date, mask).format(format);
  }

  /**
   * Форматирует дату в формате временной зоны.
   * @param {!string|number} date - Дата в формате передаваемой маски.
   * @param {string} [mask=undefined] - Формат маски на входе.
   * @returns {string} Дата в формате "YYYY-MM-DDTHH:mm:ss".
   */
  formatDateToTimezone(date: string | number, mask: string | undefined = undefined): string {
    return moment(date, mask).format('YYYY-MM-DDTHH:mm:ss');
  }

  /**
   * Возвращает начало дня для указанной даты.
   * @param {!string|number} date - Дата в формате передаваемой маски.
   * @param {!string} mask - Формат маски на входе.
   * @param {string} [format=YYYY-MM-DDTHH:mm:ss] - Формат маски на выходе. Default: "YYYY-MM-DDTHH:mm:ss".
   * @returns {string} Начало дня в указанном формате.
   */
  startDate(date: string | number, mask: string | undefined, format: string = 'YYYY-MM-DDTHH:mm:ss'): string {
    return moment(date, mask).startOf('day').format(format);
  }

   /**
   * Возвращает конец дня для указанной даты.
   * @param {!string|number} date - Дата в формате передаваемой маски.
   * @param {!string} mask - Формат маски на входе.
   * @param {string} [format=YYYY-MM-DDTHH:mm:ss] - Формат маски на выходе. Default: "YYYY-MM-DDTHH:mm:ss".
   * @returns {string} Конец дня в указанном формате.
   */
  endDate(date: string | number, mask: string | undefined, format: string = 'YYYY-MM-DDTHH:mm:ss'): string {
    return moment(date, mask).endOf('day').format(format);
  }

    /**
   * Возвращает начало указанного типа времени для текущей даты.
   * @param {!string} type - Тип времени.
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Начало указанного типа времени в указанном формате.
   */
  currentStartDateOf(type: string, format: string = 'YYYY-MM-DD'): string {
    if (!this.typesOfTime[type]) throw new ApiError(400, 'Такого типа не существует');
    return moment().startOf(this.typesOfTime[type] as moment.unitOfTime.StartOf).format(format);
  }

   /**
   * Возвращает конец указанного типа времени для текущей даты.
   * @param {!string} type - Тип времени.
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Конец указанного типа времени в указанном формате.
   */
  currentEndDateOf(type: string, format: string = 'YYYY-MM-DD'): string {
    if (!this.typesOfTime[type]) throw new ApiError(400, 'Такого типа не существует');
    return moment().endOf(this.typesOfTime[type] as moment.unitOfTime.StartOf).format(format);
  }

    /**
   * Добавляет указанное количество единиц времени к текущей дате.
   * @param {!number} amount - Количество единиц времени.
   * @param {!string} type - Единица времени. Default: "day".
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Дата в указанном формате.
   */
  addToCurrentDate(amount: number, type: string, format: string = 'YYYY-MM-DD'): string {
    return moment().add(amount, type as moment.DurationInputArg2).startOf('day').format(format);
  }

  /**
   * Отнимает указанное количество единиц времени от текущей даты.
   * @param {!number} amount - Количество единиц времени.
   * @param {!string} type - Единица времени. Default: "day".
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Дата в указанном формате.
   */
  subtractToCurrentDate(amount: number, type: string, format: string = 'YYYY-MM-DD'): string {
    return moment().subtract(amount, type as moment.DurationInputArg2).startOf('day').format(format);
  }

   /**
   * Добавляет указанное количество единиц времени к указанной дате.
   * @param {!string|number} date - Дата в формате передаваемой маски.
   * @param {!string} mask - Формат маски на входе.
   * @param {!number} amount - Количество единиц времени.
   * @param {!string} type - Единица времени. Default: "day".
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Дата в указанном формате.
   */
  addToDate(date: string | number, mask: string, amount: number, type: string, format: string = 'YYYY-MM-DD'): string {
    return moment(date, mask).add(amount, type as moment.DurationInputArg2).startOf('day').format(format);
  }

    /**
   * Отнимает указанное количество единиц времени от указанной даты.
   * @param {!string|number} date - Дата в формате передаваемой маски.
   * @param {!string} mask - Формат маски на входе.
   * @param {!number} amount - Количество единиц времени.
   * @param {!string} type - Единица времени. Default: "day".
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Дата в указанном формате.
   */
  subtractToDate(date: string | number, mask: string, amount: number, type: string, format: string = 'YYYY-MM-DD'): string {
    return moment(date, mask).subtract(amount, type as moment.DurationInputArg2).startOf('day').format(format);
  }

   /**
   * Добавляет указанное количество единиц времени к указанной дате.
   * @param {!string} date - Дата в формате "YYYY-MM-DD".
   * @param {!number} amount - Количество единиц времени.
   * @param {string} [type=day] - Единица времени. Default: "day".
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Дата в указанном формате.
   */
  addToSplashDate(date: string, amount: number, type: string = 'day', format: string = 'YYYY-MM-DD'): string {
    return moment(moment(date, 'YYYY-MM-DD').add(amount, type as moment.DurationInputArg2)).format(format);
  }

   /**
   * Отнимает указанное количество единиц времени от указанной даты.
   * @param {!string} date - Дата в формате "YYYY-MM-DD".
   * @param {!number} amount - Количество единиц времени.
   * @param {string} [type=day] - Единица времени. Default: "day".
   * @param {string} [format=YYYY-MM-DD] - Формат маски на выходе. Default: "YYYY-MM-DD".
   * @returns {string} Дата в указанном формате.
   */
  subtractToSplashDate(date: string, amount: number, type: string = 'day', format: string = 'YYYY-MM-DD'): string {
    return moment(moment(date, 'YYYY-MM-DD').subtract(amount, type as moment.DurationInputArg2)).format(format);
  }

   /**
   * Проверяет валидность даты в формате "YYYY-MM-DD".
   * @param {!string} date - Дата в формате "YYYY-MM-DD".
   * @returns {boolean} Результат проверки.
   */
  validateSplashDate(date: string): boolean {
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }

  /**
   * Вычисляет разницу между двумя датами в указанной единице времени.
   * @param {!string} date1 - Первая дата в указанном формате.
   * @param {!string} date2 - Вторая дата в указанном формате.
   * @param {string} [type=day] - Единица времени. Default: "day".
   * @param {string} [mask=YYYY-MM-DD] - Формат дат. Default: "YYYY-MM-DD".
   * @returns {number} Разница между двумя датами в указанной единице времени.
   */
  diffDate(date1: string, date2: string, type?: string, mask: string = 'YYYY-MM-DD'): number {
    return moment(date1, mask).diff(moment(date2, mask), type as moment.unitOfTime.Diff);
  }
}

export default new Moment();