const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Router } = require('express');
const router = Router();

const { User } = require('../db');


router.post('/', async (req, res) => {

  const { username, password } = req.body;
  
  
  try {

    const user = await User.findOne({ where: { username } });
    

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const isMatch = await bcrypt.compare(user.password, hashedPassword);
    console.log(isMatch)
    
    if (!isMatch) {

      return res.status(404).json({ message: 'Contraseña incorrecta' });

    }
    
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(payload, 'secret', { expiresIn: '1h' }, (error, token) => {

      if (error) throw error;
      res.json({ token });

    });
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error en el servidor post' });
  }
});


module.exports = router;
