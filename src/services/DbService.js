import connection from '../libs/db.js'
import { validateFalsyValues } from '../utils/validations.js'

class DbService {
  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * @param {String} tableName
   * @param {Array.<{columnName: string, value: string}>} registersToInsert
   */
  async insertInDB(tableName, registersToInsert) {
    const valuesCounter = registersToInsert.length
    let cuestionMarks = ''
    let nameAllColumns = ''
    for (let i = 0; i < valuesCounter; i++) {
      if (i === 0) {
        cuestionMarks = '?'
        nameAllColumns = registersToInsert[i].columnName
      } else {
        cuestionMarks = cuestionMarks + ' ?'
        nameAllColumns = nameAllColumns + ', ' + registersToInsert[i].columnName
      }
    }
    const allValuesArray = registersToInsert.map((register) => `"${register.value}"`)
    const [data] = await connection.execute(
      `INSERT INTO ${tableName} (${tableName}.${nameAllColumns}) VALUES (${allValuesArray}) `,
      allValuesArray
    )
    return data
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * @param {String} tableName
   * @param {string[]} columnsToSelect
   * @param {Array.<{columnName: string, value: string}>} whereConditions
   */
  async getRegisters(tableName, columnsToSelect, whereConditions) {
    let where = true
    if (!whereConditions) {
      whereConditions = []
      where = false
    }
    let query = ''
    let conditionsQuery = ''
    for (let i = 0; i < whereConditions.length; i++) {
      if (i === 0) {
        conditionsQuery =
          conditionsQuery +
          ` ${tableName + '.'}${whereConditions[i].columnName}='${whereConditions[i].value}'`
      } else {
        conditionsQuery =
          conditionsQuery +
          ' AND ' +
          `${whereConditions[i].columnName}="${whereConditions[i].value}"`
      }
    }
    let columns = ''
    for (let i = 0; i < columnsToSelect.length; i++) {
      if (i === 0) {
        columns = columnsToSelect[i]
      } else {
        columns = columns + ', ' + columnsToSelect[i]
      }
    }
    query = `SELECT ${columns} FROM ${tableName} ${where ? 'WHERE' : ''}${
      conditionsQuery || ''
    }`
    const data = await connection.execute(query)
    return data
  }

  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * @param {String} tableName
   * @param {Array.<{columnName: string, value: string}>} whereConditions
   */
  async deleteRegisters(tableName, whereConditions) {
    try {
      validateFalsyValues([whereConditions])
    } catch (e) {
      console.error(e)
    }
    let query = ''
    let conditionsQuery = ''
    for (let i = 0; i < whereConditions.length; i++) {
      if (i === 0) {
        conditionsQuery =
          conditionsQuery +
          ` ${whereConditions[i].columnName}="${whereConditions[i].value}"`
      } else {
        conditionsQuery =
          conditionsQuery +
          ' AND ' +
          `${whereConditions[i].columnName}="${whereConditions[i].value}"`
      }
    }
    query = `DELETE FROM ${tableName} WHERE ${conditionsQuery}`
    try {
      const data = await connection.execute(query)
      return data
    } catch (e) {
      console.error(e)
    }
  }
  /* -------------------------------------------------------------------------------------------------- */
  /* -------------------------------------------------------------------------------------------------- */

  /**
   * @param {String} tableName
   * @param {Array.<{columnName: string, value: string}>} newColumns
   * @param {Array.<{columnName: string, value: string}>} whereConditions
   */
  async updateRegisters(tableName, newColumns, whereConditions) {
    let query = ''

    let newValuesQuery = ''
    for (let i = 0; i < newColumns.length; i++) {
      if (i === 0) {
        newValuesQuery = `${newColumns[i].columnName}=${newColumns[i].value}`
      } else {
        newValuesQuery = `${newValuesQuery}, ${newColumns[i].columnName}=${newColumns[i].value}`
      }
    }

    let conditionsQuery = ''
    for (let i = 0; i < whereConditions.length; i++) {
      if (i === 0) {
        conditionsQuery =
          conditionsQuery +
          ` ${whereConditions[i].columnName}="${whereConditions[i].value}"`
      } else {
        conditionsQuery =
          conditionsQuery +
          ' AND ' +
          `${whereConditions[i].columnName}="${whereConditions[i].value}"`
      }
    }

    query = `UPDATE ${tableName} SET ${newValuesQuery} WHERE ${conditionsQuery}`

    const data = connection.execute(query)
    return data
  }
}

export default DbService
