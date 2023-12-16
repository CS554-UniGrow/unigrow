import { dbConnection } from "./mongoConnection"

const getCollectionFn = (collection: string) => {
  let _col: any = undefined // You might want to specify a more specific type for _col

  return async () => {
    if (!_col) {
      const db = await dbConnection()
      _col = db.collection(collection)
    }

    return _col
  }
}

// Note: You will need to change the code below to have the collection required by the assignment!
export const courses = getCollectionFn("courses")
export const users = getCollectionFn("users")
