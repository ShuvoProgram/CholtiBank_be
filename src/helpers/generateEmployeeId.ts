export function generateEmployeeId(prefix: string): string {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
    const employeeId = `${prefix}${currentYear}${randomDigits}`;
    return employeeId;
  }