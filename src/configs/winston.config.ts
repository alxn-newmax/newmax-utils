interface IConfig {
  levels: {
    [key: string]: number;
  },
  colors: {
    [key: string]: string;
  },
  colorsCode: {
    [key: string]: number;
  },
  emoji: {
    [key: string]: string;
  }
}

export const winstonConfig: IConfig = {
  levels: {
    error: 0,
    warn: 1,
    done: 2,
    info: 3,
    debug: 4,
    custom: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    done: 'green',
    info: 'blue',
    debug: 'magenta',
    custom: 'cyan',
  },
  colorsCode: {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    grey: 90,
  },
  emoji: {
    error: '🔴',
    warn: '🟡',
    done: '🟢',
    info: '🔵',
    debug: '🟣',
    custom: '⚪️',
  },
};
