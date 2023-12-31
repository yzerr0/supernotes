const storage = {
    get: <T>(key: string, defaultValue?: T): T => {
        const value = localStorage.getItem(key)
        return value ? JSON.parse(value) : defaultValue;
    },
    set: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key: string) => {
        localStorage.removeItem(key)
    }
}

export default storage;