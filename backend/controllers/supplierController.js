// controllers/supplierController.js
const Supplier = require('../models/supplier');

exports.addSupplier = async (req, res) => {
    const supplierData = req.body;

    const newSupplier = new Supplier({
        supplierName: supplierData.supplierName,
        phoneNumber: supplierData.phoneNumber,
        mobileNumber: supplierData.mobileNumber,
        address: supplierData.address,
        emailId: supplierData.emailId,
        website: supplierData.website,
        city: supplierData.city,
        pinCode: supplierData.pinCode,
        panNo: supplierData.panNo,
        priceList: supplierData.priceList,
        country: supplierData.country,
        opening: supplierData.opening,
        loyalityNo: supplierData.loyalityNo,
        GSTno: supplierData.GSTno,
        dueDays: supplierData.dueDays,
        formalName: supplierData.formalName,
        openBill: supplierData.openBill,
        bank: supplierData.bank,
        isActive: supplierData.isActive,
        allowCredit: supplierData.allowCredit,
    });

    try {
        const savedSupplier = await newSupplier.save();
        res.status(201).json(savedSupplier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add supplier' });
    }
};

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get suppliers' });
    }
};
exports.getPurchaseData = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ 'purchaseData.purchaseNumber': { $exists: true, $ne: null } });
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get suppliers' });
    }
};

exports.getItemsData = async (req, res) => {
    try {
        const suppliers = await Supplier.find();

        const itemsData = suppliers.flatMap(supplier =>
            supplier.purchaseData.flatMap(purchase => purchase.itemsData)
        );

        res.status(200).json(itemsData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get items data' });
    }
};


exports.addPurchaseData = async (req, res) => {
    const { selectedSupplierId, purchaseDetails, itemsData } = req.body; 

    console.log(purchaseDetails);
    try {
      const supplierDocument = await Supplier.findById(selectedSupplierId);
      
      if (!supplierDocument) {
        return res.status(404).json({ message: 'Supplier not found' });
      }

      const purchaseDataEntry = {
        ...purchaseDetails,
        itemsData: itemsData 
      };

      supplierDocument.purchaseData.push(purchaseDataEntry);
    
      const updatedSupplier = await supplierDocument.save();
      
      res.status(200).json(updatedSupplier);
  
    } catch (error) {
      console.error('Error adding purchaseData to supplier document:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

