export const waitForTimer = async (time: number) => {
  await new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export const sleepSync = async (time: number) => {
  await new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
