const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
router.get('/add', isLoggedIn, (req, res) => {
    // res.send('form');
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req,res) => {
    const { title, url, description } = req.body
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO links set ?', [newLink]);
    // console.log(newLink);
    // console.log(req.body);
    // res.send('received')
    req.flash('success', 'Link Saved Succesfully');
    res.redirect('/links');
    
});

router.get('/', isLoggedIn, async (req, res ) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id ]);
    console.log(links);
    // res.send('Listas iran aqui');
    res.render('links/list', { links })
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Link Removed Succesfully');
    res.redirect('/links');
    // console.log(req.params.id);
    // res.send('Deleted');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { link: links[0] });
    
    // console.log(id);
    // res.send('Recived');
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Succesfully');
    res.redirect('/links');
});

module.exports = router;