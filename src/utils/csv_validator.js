export default validateCSVString = (csvString) => {
  const errors = [];

  // Split the CSV string into rows (separated by new lines)
  const rows = csvString.trim().split('\n');

  rows.forEach((row, rowIndex) => {
    // Use a regular expression to properly handle quoted commas
    const columns = row.match(/("([^"]*)"|[^",\n]+)(?=\s*,|\s*$)/g).map(col => col.trim());

    // Ensure the row has at least 2 columns: 1 question and 1 answer
    if (columns.length < 2) {
      errors.push(`Row ${rowIndex + 1} is invalid: At least 1 question and 1 answer are required.`);
      return;
    }
    
    // Validate the first field (question) is properly quoted
    const question = columns[0];
    if (!isValidQuotedString(question)) {
      errors.push(`Row ${rowIndex + 1} is invalid: Question must be quoted correctly.`);
    }

    // Validate answers (fields 2 and onward) are properly quoted
    for (let i = 1; i < columns.length; i++) {
      const answer = columns[i];
      if (!isValidQuotedString(answer)) {
        errors.push(`Row ${rowIndex + 1} is invalid: Answer ${i} must be quoted correctly.`);
      }
    }
  });

  // Return errors if any, else return true if the CSV format is valid
  if (errors.length > 0) {
    return errors;
  }
  return true;
};

// Helper function to check if a string is correctly quoted
const isValidQuotedString = (str) => {
  // Check if the string is properly quoted
  if (!str.startsWith('"') || !str.endsWith('"')) {
    return false;
  }

  // Check if there are any invalid quotes inside (i.e., no single " within the quoted string)
  // Valid quoted string should have "" for quotes inside
  const innerStr = str.slice(1, str.length - 1); // Remove the outer quotes
  return !innerStr.includes('"');
};