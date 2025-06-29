
// Function TO generate Username

const fs = require('fs');
const XLSX = require('xlsx');
const User = require('../model/user.model');

function generateUsername(firstName, lastName, grade) {
  const prefix = `${firstName}${lastName}${grade}`;
  return `${prefix}`;
}

const bulkRegister = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!fs.existsSync(req.file.path)) {
      return res.status(404).json({ 
        message: 'Upload failed - file not found',
        path: req.file.path 
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty or invalid' });
    }

    const results = await Promise.all(data.map(async (row) => {
      try {
        if (!row.name?.trim() || !row.surname?.trim()) {
          return { name: row.name || 'Missing', surname: row.surname || 'Missing', status: 'FAILED', error: 'Missing required fields' };
        }

        const username = generateUsername(row.name, row.surname, row.grade);
        const password = 'ISM2025';

        const user = new User({
          username,
          password,
          name: row.name,        
          surname: row.surname,  
          grade: row.grade || 'Not Specified',
          role: row.role || 'student'  
      });
        await user.save();
        return { name: row.name, surname: row.surname, username, password, status: 'SUCCESS' };

      } catch (error) {
        return { name: row.name || 'Unknown', surname: row.surname || 'Unknown', status: 'FAILED', error: error.message };
      }
    }));

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete uploaded file:', err);
    });

    res.status(200).json({
      message: 'Bulk registration completed',
      totalProcessed: data.length,
      successful: results.filter(r => r.status === 'SUCCESS').length,
      failed: results.filter(r => r.status === 'FAILED').length,
      results: results.slice(0, 100) // Limit response to 100 entries
    });

  } catch (error) {
    console.error('Bulk Registration Failed:', error);
    res.status(500).json({ message: 'Bulk Registration Failed!', error: error.message });
  }
};

module.exports = bulkRegister;
