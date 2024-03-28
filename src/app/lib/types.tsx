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

/**
 * Holds three booleans: enabled/disabled white text, enabled/disabled auto-selecting the next task when finished, enabled/disabled auto-deselect when 
 * reaching a task's limit.
 */
export type CheckboxSettingsInfo = {whiteText: boolean, autoSelectNext: boolean, autoDeselectFinished: boolean};

/**
 * Holds one value: a number for how loud the alarm sound should be.
 */
export type VolumeSettingsInfo = {alarmSound: number};