var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { parse } from "csv-parse/browser/esm/sync";
var PAYMENT = /PAYMENT - THANK YOU.*$/;
var RETURN = /RETURN:.*$/;
var SALES = "SALES: ";
var TRANSACTION_DATE_INDEX = 1; // zero indexedconst SALES = "SALES: "
var DESCRIPTION_INDEX = 2; // column index for Description
var AMOUNT_INDEX = 4; // column index for Amount(HKD)
var cast = function (value) {
    return value.replace(/\s+/g, " ").replace(SALES, "").trim();
};
var onRecord = function (_a, context) {
    var raw = _a.raw, record = _a.record;
    if (context.error &&
        context.error.code === "CSV_RECORD_INCONSISTENT_COLUMNS") {
        // find the 3rd comma in the line and excise it as it's probably incorrectly part of the payee's name (and shouldn't be but HSBC are crap so...)
        var stringRaw = raw;
        var counter = 3; // zero-based index
        var nThIndex = 0;
        if (counter > 0) {
            while (counter--) {
                // Get the index of the next occurence
                nThIndex = stringRaw.indexOf(",", nThIndex + ",".length);
            }
        }
        stringRaw =
            stringRaw.substring(0, nThIndex) +
                stringRaw.substring(nThIndex + ",".length);
        // call CSV.parse() again on the newly constructed line. This time should return the correct number of fields.
        var result = parse(stringRaw, {
            raw: true,
            trim: true,
            onRecord: onRecord,
            cast: cast,
        });
        return result[0];
    }
    // Purchase amounts need to be negative for Xero import
    // Payments and rerurns are positive amounts (credits) in Xero
    // HSBC CSV has everything as a positive value
    if (record[DESCRIPTION_INDEX].match(PAYMENT) ||
        record[DESCRIPTION_INDEX].match(RETURN)) {
        // do nothing. The amount is already positive
        console.log("Leave value positive", record[DESCRIPTION_INDEX]);
    }
    else {
        // change the value to a negative value
        record[AMOUNT_INDEX] = (Number(record[AMOUNT_INDEX]) * -1).toString();
    }
    // delete rows where there is only data in the 0th column (garbage)
    if (record[TRANSACTION_DATE_INDEX].trim() === "")
        return null;
    // return Post Date, Txn Amount, null, Description + Foreign CCY Amt
    return [record[0], record[4], "", record[2] + " " + record[3]];
};
export var csvOnload = function (reader) {
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var raw, rawData, data;
        return __generator(this, function (_a) {
            raw = reader.result;
            rawData = raw.slice(raw.indexOf("\n") + 1);
            data = parse(rawData, {
                relax_column_count: true,
                trim: true,
                raw: true,
                cast: cast,
                onRecord: onRecord,
            });
            // replace the header
            data[0] = ["Date", "Amount", "Payee", "Description"];
            return [2 /*return*/];
        });
    }); };
};
