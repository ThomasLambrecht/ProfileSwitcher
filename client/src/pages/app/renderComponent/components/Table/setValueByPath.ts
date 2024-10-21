const setValueByPath = (row: any, path: string, value: any): void => {
  const keys = path.split(".")

  // Use reduce to navigate to the second last key
  const lastKey = keys.pop() // Get the last key
  const target = keys.reduce((current, key) => {
    // If the key doesn't exist, create an empty object
    if (!current[key]) {
      current[key] = {}
    }
    return current[key] // Move deeper into the object
  }, row)

  // Set the value at the last key
  if (lastKey) {
    target[lastKey] = value
  }
}

export default setValueByPath
