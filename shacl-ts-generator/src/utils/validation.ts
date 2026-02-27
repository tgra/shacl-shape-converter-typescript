export class ValidationErrorCollector {
  private errors: string[] = []

  add(message: string) {
    this.errors.push(message)
  }

  hasErrors() {
    return this.errors.length > 0
  }

  printAndExit() {
    console.error("\nSHACL validation failed:")

    this.errors.forEach(err => {
      console.error(` - ${err}`)
    })

    process.exit(1)
  }
}