import logo from './logo.svg';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './Components/NavBar';
import Main from './Components/Main2';
import Purchase from './Components/Purchase';
import PurchaseReturn from './Components/PurchaseReturn';
import PurchaseOrderList from './Components/PurchaseOrderList';
import StockList from './Components/StockList.js';
import BatchList from './Components/BatchList.js';
import Products from './Components/products.js';
import ItemList from './Components/ItemList.js';
import CustomerForm from './Components/CustomerForm.js';
import SchemePurchase from './Components/SchemPurchase.js';
import Login from './Components/LoginPage1.js';
import Register from './Components/Register.js';

//Production
import ProductionScheme from './Components/Production/SchemeList.js';
import ProductionPurchase from './Components/Production/ProductionScheme.js';
import ProductionpurchaseList from './Components/Production/productionCustomerList.js';
//DEMO
import Demo from './Components/Demo.js';
function App() {
  return (
    <div >
    <BrowserRouter>
        <Routes>
          {/* <Route path='/' element={<Main />} /> */}
          <Route path='/' element={<Purchase />} />
          <Route path='/purchase' element={<Purchase />} />
          <Route path='/purchasereturn' element={<PurchaseReturn />} />
          <Route path='/purchaseorder' element={<PurchaseOrderList />} />
          <Route path='/stock' element={<StockList />} />
          <Route path='/item' element={<ItemList />} />
          <Route path='/batch' element={<BatchList />} />
          <Route path='/products' element={<Products />} />
          <Route path='/customerForm' element={<CustomerForm />} />
          <Route path='/schemPurchase' element={<SchemePurchase />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/productionScheme' element={<ProductionScheme />} />
          <Route path='/productionpurchase' element={<ProductionPurchase />} />
          <Route path='/productionCustomerList' element={<ProductionpurchaseList />} />
          <Route path='/demo' element={<Demo />} />
        </Routes>
      
    </BrowserRouter>
    </div>
  );
}

export default App;
