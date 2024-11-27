var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require.main.require('./models/db_controller');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Middleware for session management (optional)
router.get('*', function (req, res, next) {
    next();
});

// Route to get all roles and render roles.ejs
router.get('/', function (req, res) {
    db.getAllRoles(function (err, roles) {
        if (err) {
            console.error("Error fetching roles:", err);
            return res.status(500).send('Server Error');
        }

        if (!roles || roles.length === 0) {
            return res.status(404).send('No roles found');
        }

        res.render('roles.ejs', { list: roles });
    });
});

// Route to edit a role
router.post('/edit_role/:id', function (req, res) {
    var roleId = req.params.id;
    var updatedRoleName = req.body.role_name; // Assuming your input field name is 'role_name'

    db.updateRole(roleId, updatedRoleName, function (err) {
        if (err) {
            console.error("Error updating role:", err);
            return res.status(500).send('Could not update role');
        }

        req.flash('success', 'Role Edited Successfully');
        res.redirect('/roles'); // Redirect to roles page after updating
    });
});

// Route to delete a role
router.get('/delete_role/:id', function (req, res) {
    var roleId = req.params.id;

    db.deleteRole(roleId, function (err) {
        if (err) {
            console.error("Error deleting role:", err);
            return res.status(500).send('Could not delete role');
        }
        req.flash('success', 'Role Deleted Successfully');
        res.redirect('/roles'); // Redirect to roles page after deleting
    });
}); 

// Route to add a new role
router.post('/add_role', function (req, res) {
    var roleId = req.params.id;
    var newRoleName = req.body.role_name;

    db.getRoleId(function (err, result) {
        if (err) {
            console.error('Error fetching max role_id:', err);
            return res.status(500).send('Error fetching last role ID.');
        }

        const newRoleId = result[0].maxId ? result[0].maxId + 1 : 1;
        db.addRole(newRoleId, newRoleName, function (err1) {
            if (err1) {
                console.error("Error adding role:", err);
                return res.status(500).send('Could not add role');
            }
            req.flash('success','New Role Added');
            res.redirect('/roles'); // Redirect back to the roles page after adding
        });
    });
});

module.exports = router;
