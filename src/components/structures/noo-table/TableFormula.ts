export class TableFormula {
  #stringRepresentaion: string

  constructor(formula: string) {
    this.#stringRepresentaion = formula
  }

  static validate(formula: string): boolean {
    return formula.length > 0
  }
}
