import { parse, CastingContext } from 'csv-parse/browser/esm/sync'

const PAYMENT = /PAYMENT - THANK YOU.*$/
const RETURN = /RETURN:.*$/
const SALES = "SALES: "
const TRANSACTION_DATE_INDEX = 1 // zero indexedconst SALES = "SALES: "
const DESCRIPTION_INDEX = 2 // column index for Description
const AMOUNT_INDEX = 4 // column index for Amount(HKD)

const cast = (value: string) => {
    return value.replace(/\s+/g, " ").replace(SALES, "").trim()
}

const onRecord = (
    { raw, record }: { raw: string; record: string[] },
    context: CastingContext
) => {
    if (
        context.error &&
        context.error.code === "CSV_RECORD_INCONSISTENT_COLUMNS"
    ) {
        // find the 3rd comma in the line and excise it as it's probably incorrectly part of the payee's name (and shouldn't be but HSBC are crap so...)
        let stringRaw = raw as string
        let counter = 3 // zero-based index
        let nThIndex = 0

        if (counter > 0) {
            while (counter--) {
                // Get the index of the next occurence
                nThIndex = stringRaw.indexOf(",", nThIndex + ",".length)
            }
        }

        stringRaw =
            stringRaw.substring(0, nThIndex) +
            stringRaw.substring(nThIndex + ",".length)
        // call CSV.parse() again on the newly constructed line. This time should return the correct number of fields.
        const result = parse(stringRaw, {
            raw: true,
            trim: true,
            onRecord: onRecord,
            cast: cast,
        })
        return result[0]
    }

    // Purchase amounts need to be negative for Xero import
    // Payments and rerurns are positive amounts (credits) in Xero
    // HSBC CSV has everything as a positive value
    setSign(record)

    // delete rows where there is only data in the 0th column (garbage)
    if (record[TRANSACTION_DATE_INDEX].trim() === "") return null

    // return Post Date, Txn Amount, null, Description + Foreign CCY Amt
    return [record[0], record[4], "", `${record[2]} ${record[3]}`]
}

function setSign(record: string[]) {
    if (record[DESCRIPTION_INDEX].match(PAYMENT) ||
        record[DESCRIPTION_INDEX].match(RETURN)) {
        // do nothing. The amount is already positive
        return
    }

    // change the value to a negative value
    record[AMOUNT_INDEX] = `-${record[AMOUNT_INDEX]}`
}

export function csvParse(
    fileContents: string,
    csvData: string[][]
) {
    // get the raw data, skipping the document title e.g. "World Business MasterCard xxxx-xxxx-xxxx-1234"
    const raw = fileContents
    const rawData = raw.slice(raw.indexOf(`\n`) + 1)
    // parse the raw data into a 2d array of strings
    csvData = parse(rawData, {
        relax_column_count: true,
        trim: true,
        raw: true,
        cast: cast,
        onRecord: onRecord,
    })
    // replace the HSBC CSV header with the Xero header
    csvData[0] = ["Date", "Amount", "Payee", "Description"]
    
    return csvData
}
