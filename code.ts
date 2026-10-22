// @ts-nocheck — Google Apps Script file (not part of the Vite build)
/**
 * Pubudu & Kavindya — Homecoming Invitation
 * Google Apps Script backend for RSVP + Wishes.
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1E4oiS7GXuMPJ2IGj6s6R_idprQqgui340BbgGxjFFjY/edit
 *
 * Paste this whole file into Extensions → Apps Script (Code.gs), then
 * Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
 * The "RSVP" and "Wishes" sheets (with headers) are created automatically.
 */

var SPREADSHEET_ID = '1E4oiS7GXuMPJ2IGj6s6R_idprQqgui340BbgGxjFFjY';

var SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Phone', 'Attendance', 'Guests', 'Message'],
    widths: [170, 220, 140, 130, 80, 320],
  },
  WISHES: {
    name: 'Wishes',
    headers: ['Timestamp', 'Guest Name', 'Message'],
    widths: [170, 220, 480],
  },
};

var HEADER_BG = '#5C1A2B';   // royal maroon
var HEADER_FG = '#F8E7B9';   // champagne gold

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = parsePayload_(e);
    var type = String(data.sheet || '').toUpperCase();

    if (type === 'RSVP') {
      var rsvp = getOrCreateSheet_(SHEETS.RSVP);
      rsvp.appendRow([
        new Date(),
        clean_(data.name),
        clean_(data.phone),
        clean_(data.attendance) || 'Attending',
        clean_(data.guests) || '1',
        clean_(data.message),
      ]);
      return json_({ result: 'success', sheet: SHEETS.RSVP.name, row: rsvp.getLastRow() });
    }

    if (type === 'WISHES' || type === 'WISH') {
      var wishes = getOrCreateSheet_(SHEETS.WISHES);
      wishes.appendRow([
        new Date(),
        clean_(data.name),
        clean_(data.message),
      ]);
      return json_({ result: 'success', sheet: SHEETS.WISHES.name, row: wishes.getLastRow() });
    }

    return json_({ result: 'error', error: 'Unknown sheet "' + data.sheet + '". Use RSVP or Wishes.' });
  } catch (error) {
    return json_({ result: 'error', error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET ?action=wishes  → latest wishes (newest first) for the guestbook.
 * GET (no action)     → health check.
 */
function doGet(e) {
  var action = e && e.parameter ? String(e.parameter.action || '') : '';

  if (action === 'wishes') {
    var sheet = getOrCreateSheet_(SHEETS.WISHES);
    var lastRow = sheet.getLastRow();
    var wishes = [];

    if (lastRow > 1) {
      var rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = rows.length - 1; i >= 0 && wishes.length < 50; i--) {
        if (!rows[i][1] || !rows[i][2]) continue;
        wishes.push({
          id: String(i + 2),
          name: String(rows[i][1]),
          message: String(rows[i][2]),
          createdAt: rows[i][0] instanceof Date ? rows[i][0].toISOString() : String(rows[i][0]),
        });
      }
    }

    return json_({ result: 'success', wishes: wishes });
  }

  return json_({ result: 'success', message: 'Pubudu & Kavindya homecoming endpoint is running.' });
}

/** Run once from the editor to create both sheets up front (optional). */
function setup() {
  getOrCreateSheet_(SHEETS.RSVP);
  getOrCreateSheet_(SHEETS.WISHES);
}

function getOrCreateSheet_(config) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(config.name);

  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }

  if (sheet.getLastRow() === 0) {
    var header = sheet.getRange(1, 1, 1, config.headers.length);
    header.setValues([config.headers]);
    header
      .setFontWeight('bold')
      .setBackground(HEADER_BG)
      .setFontColor(HEADER_FG)
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    for (var c = 0; c < config.widths.length; c++) {
      sheet.setColumnWidth(c + 1, config.widths[c]);
    }
  }

  return sheet;
}

function parsePayload_(e) {
  var data = {};
  if (e && e.parameter) {
    for (var key in e.parameter) data[key] = e.parameter[key];
  }
  if (e && e.postData && e.postData.type === 'application/json' && e.postData.contents) {
    var body = JSON.parse(e.postData.contents);
    for (var k in body) data[k] = body[k];
  }
  return data;
}

function clean_(value) {
  var text = value === undefined || value === null ? '' : String(value).trim();
  // Prevent formula injection in the sheet
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
