var mysql = require('mysql');
var express = require('express');
var cookie = require('cookie-parser');
var db = require.main.require('./models/db_controller');

var router = express.Router();
router.get('*', function (req, res, next) {
    // if(req.cookies['username'] == null){
    // res.redirect('/login');
    // }else{
    next();
    // }
});

router.get('/', function (req, res) {
    db.getAllPharmacy(function (err, result) {
        if (err) {
            console.error('Error fetching pharmacy data:', err);
        }

        // Render the store.ejs template with the results and messages
        res.render('store.ejs', {
            list: result
        });
    });
});

router.get('/add_item', function (req, res) {
    db.getAllSuppliers(function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send('error fetching specialities');
        }
        res.render('add_edit_store.ejs', { suppliers: result, isEditing: false, item: [] });
    });
});

router.post('/add_item', function (req, res) {
    const { name, purchase_date, expire_date, price, quantity, supplier_id } = req.body;
    db.getAllSuppliers(function (err, suppliers) {
        if (err) {
            console.error('Error fetching suppliers:', err);
            return res.status(500).send('Error fetching Suppliers.');
        }

        db.addPharmacy(name, purchase_date, expire_date, price, quantity, supplier_id, function (err, result) {
            if (err) {
                console.error("Error adding pharmacy:", err);
                return res.status(500).send('Error adding pharmacy.');
            }

            req.flash('success', 'Pharmacy added successfully ');
            res.redirect('/store');
        });
    });
});

router.get('/edit_item/:id', function (req, res) {
    const id = req.params.id;

    db.getAllPharmacyByID(id, function (err, item) {
        if (err) {
            console.error("Error fetching item:", err);
            return res.status(500).send('Error fetching item.');
        }

        db.getAllSuppliers(function (err, suppliers) {
            if (err) {
                console.error("Error fetching suppliers:", err);
                return res.status(500).send('Error fetching suppliers.');
            }

            res.render('add_edit_store.ejs', {
                suppliers: suppliers,
                isEditing: true, // Flag to indicate editing mode
                item: item[0], // Pass the item object to pre-fill fields
            });
        });
    });
});

router.post('/edit_item/:id', function (req, res) {
    var id = req.params.id;
    db.updatePharmacy(id, req.body.name, req.body.p_date, req.body.expire, req.body.e_date, req.body.price, req.body.quantity, function (err, result) {
        if (err) {
            console.error("Error updating Pharmacy:", err);
            return res.status(500).send('Error updating Pharmacy.');
        }
        req.flash('success', 'Pharmacy updated');
        res.redirect('/store');
    });

});

router.post('/delete_item/:id', function (req, res) {
    var id = req.params.id;
    db.deletePharmacy(id,function(err,res1){
        if(err){
            console.error("Error deleting pharmacy item",err);
            return res.status(500).send('Error deleting Pharmacy');
        }
        req.flash('success','Pharmacy item deleted');
        res.redirect('/store');
    });
});

router.post('/search', function (req, res) {
    var key = req.body.search;

    // Ensure key is not empty
    if (!key) {
        return res.render('store.ejs', { list: [], error: 'Please provide a search term.' });
    }

    db.searchMed(key, function (err, result) {
        if (err) {
            console.error("Error searching medicines:", err);
            return res.status(500).send('Error searching medicines.');
        }

        // Ensure result is an array
        if (!Array.isArray(result)) {
            return res.render('store.ejs', { list: [], error: 'Invalid search result format.' });
        }

        // Render the results to the store view
        res.render('store.ejs', { list: result });
    });
});

// router.post('/search', function (req, res) {
//     var key = req.body.search;
//     db.searchMed(key, function (err, result) {
//         res.render('store.ejs', { list: result });
//     });
// });

module.exports = router;