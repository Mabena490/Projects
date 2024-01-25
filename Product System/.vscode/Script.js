const express = require('express');
const sql = require('mssql/msnodesqlv8');
const bodyParser = require('body-parser');
const cors = require('cors');
 
const app = express();
const PORT = 3001;
 
const config = {
    server: 'SINGLRN-TIISETS\MSSQLSERVER02',
    database: 'Product_System',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};
 
 
 
app.use(cors());
 
app.get('/products', (req, res) => {
    sql.connect(config, err => {
        if (err) {
            console.error('Error connecting to the database: ' + err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
 
        const request = new sql.Request();
        request.query('SELECT * FROM Products', (err, records) => {
            sql.close();
 
            if (err) {
                console.error('Error executing query: ' + err.message);
                res.status(500).send('Internal Server Error');
                return;
            }
 
            res.json(records.recordset);
        });
    });
});
 
app.use(bodyParser.json());
 
app.post('/register', (req, res) => {
    const formData = req.body;
 
    sql.connect(config, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error occurred while connecting to the database.');
        }
 
        const request = new sql.Request();
 
        // Insert data into the 'users' table
        request.query(`INSERT INTO users (firstName, lastName, addressType, streetAddress, suburb, city, postalCode)
                       VALUES ('${formData.firstName}', '${formData.lastName}', '${formData.addressType}',
                               '${formData.streetAddress}', '${formData.suburb}', '${formData.city}', '${formData.postalCode}')`,
            (err, result) => {
                sql.close();
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error occurred while inserting data into the database.');
                }
                console.log('User registered successfully');
                res.json({ message: 'User registered successfully' });
            }
        );
    });
});
 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});