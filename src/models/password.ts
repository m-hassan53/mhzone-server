export class Password {
  public salt: string;
  public hash: string;
  public iterations: number;

  constructor(salt: string, hash: string, iterations: number) {
    this.salt = salt;
    this.hash = hash;
    this.iterations = iterations;
  }
}
