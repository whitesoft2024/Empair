const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const supplierRoutes = require('./routes/supplierRoutes');
const groupStockRoutes = require('./routes/groupStock');
const UOMStockRoutes = require('./routes/UOMstockRoute');
const brandStockRoutes = require('./routes/brandstockRoute');
const addItemRoutes = require('./routes/addItemRoute');
const addSchemeRoutes = require('./routes/addSchemeRoutes');
const SchemeRoutes = require('./routes/schemeRoute');
const addCustomersRoutes = require('./routes/addCustomerRoute');
const addLoginRoutes = require('./routes/loginRoutes');
const posRoute=require('./routes/PosRoute')
const register=require('./routes/RegisterRoute.js')

require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
mongoose.set('strictQuery', false);
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB  
const connect = mongoose.connect(process.env.MONGO_URL);
connect
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(supplierRoutes); 
app.use(groupStockRoutes);
app.use(UOMStockRoutes);
app.use(brandStockRoutes);
app.use(addItemRoutes);
app.use(addSchemeRoutes);
app.use(addCustomersRoutes);
app.use(addLoginRoutes);
app.use(SchemeRoutes);
app.use(posRoute)
app.use(register)
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT; 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});