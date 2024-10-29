export const getNextDateFormatted = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const day = String(tomorrow.getDate()).padStart(2, '0')
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const year = String(tomorrow.getFullYear()).slice(-2)

    return `${day}.${month}.${year}`
}
export const getCurrentDateFormatted = () => {
    const today = new Date()

    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = String(today.getFullYear()).slice(-2)

    return `${day}.${month}.${year}`
}

export const getYesterdayDateFormatted = () => {
    const today = new Date()
    today.setDate(today.getDate() - 1)

    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = String(today.getFullYear()).slice(-2)

    return `${day}.${month}.${year}`
}

export const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
}

export const getIsFirstHalfOfDay = (time) => {
    const [hours, minutes] = time.split(':').map(Number)

    return hours < 12
}