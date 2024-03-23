/**
 * Denotes the three states of the pomodoro timer.
 */
export type TimerType = "pomodoro" | "shortbreak" | "longbreak";

/**
 * Holds three numbers: the length of each timer type.
 */
export type TimerInformation = {pomodoro: number, shortbreak: number, longbreak: number};

/**
 * Holds three strings: the color of each timer type.
 */
export type ColorInformation = {pomodoro: string, shortbreak: string, longbreak: string};

/**
 * Contains a number for id, string for the Task's description, number for the current progress count, and a number for the upper limit of progress.
 */
export type Task = {id: number, taskDesc: string, pomoCount: number, pomoLimit: number, editing: boolean};

/**
 * Contains an array of Tasks.
 */
export type TaskList = Array<{id: number, taskDesc: string, pomoCount: number, pomoLimit: number, editing: boolean}>;