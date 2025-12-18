const fs = require('fs');
const jsPDF = require('jspdf').jsPDF;
require('jspdf-autotable');

// Export calendar to different formats
async function exportCalendar(calendar, format) {
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(calendar, null, 2);
    
    case 'csv':
      return exportToCSV(calendar);
    
    case 'pdf':
      return await exportToPDF(calendar);
    
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// Export to CSV
function exportToCSV(calendar) {
  const headers = ['Date', 'Day', 'Tithi', 'Nakshatra', 'Festivals', 'National Holiday', 'Notes'];
  const rows = [];
  
  calendar.forEach(day => {
    const festivals = day.festivals.map(f => 
      typeof f === 'string' ? f : f.en || f.name || ''
    ).join('; ');
    
    const notes = day.notes.map(n => n.title).join('; ');
    
    rows.push([
      day.date,
      typeof day.day === 'string' ? day.day : day.day.en || '',
      typeof day.tithi === 'string' ? day.tithi : day.tithi.en || '',
      typeof day.nakshatra === 'string' ? day.nakshatra : day.nakshatra.en || '',
      festivals,
      day.nationalHoliday ? 'Yes' : 'No',
      notes
    ]);
  });
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Add footer with branding
  const footer = '\n\nPowered by SA-privateLimited.com\nContact: +91 8210900726';
  
  return csvContent + footer;
}

// Export to PDF
async function exportToPDF(calendar) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;
  const lineHeight = 7;
  const margin = 10;
  
  // Title
  doc.setFontSize(16);
  doc.text('Hindu Panchang Calendar', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Group by month
  const months = {};
  calendar.forEach(day => {
    const month = day.date.substring(0, 7); // YYYY-MM
    if (!months[month]) {
      months[month] = [];
    }
    months[month].push(day);
  });
  
  // Generate PDF for each month
  Object.keys(months).sort().forEach((month, monthIndex) => {
    if (monthIndex > 0 && yPos > pageHeight - 50) {
      addFooter(doc, pageWidth, pageHeight);
      doc.addPage();
      yPos = 20;
    }
    
    // Month header
    doc.setFontSize(14);
    doc.text(month, margin, yPos);
    yPos += 10;
    
    // Table headers
    doc.setFontSize(10);
    const tableData = [];
    
    months[month].forEach(day => {
      const festivals = day.festivals.map(f => 
        typeof f === 'string' ? f : f.en || f.name || ''
      ).join(', ');
      
      tableData.push([
        day.date.substring(8),
        typeof day.day === 'string' ? day.day : day.day.en || '',
        typeof day.tithi === 'string' ? day.tithi.substring(0, 20) : (day.tithi.en || '').substring(0, 20),
        festivals.substring(0, 30)
      ]);
    });
    
    doc.autoTable({
      startY: yPos,
      head: [['Date', 'Day', 'Tithi', 'Festivals']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: yPos }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
  });
  
  // Add footer to last page
  addFooter(doc, pageWidth, pageHeight);
  
  return doc.output('arraybuffer');
}

// Add footer with branding information
function addFooter(doc, pageWidth, pageHeight) {
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Powered by SA-privateLimited.com', pageWidth / 2, footerY - 5, { align: 'center' });
  doc.text('Contact: +91 8210900726', pageWidth / 2, footerY, { align: 'center' });
}

module.exports = {
  exportCalendar
};

