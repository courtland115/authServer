const  { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
  
   
    const { email, name, password } = req.body;

    try {

        //verificar si el correo es unico
        const usuario = await Usuario.findOne({ email });

        if ( usuario ) {

            return res.status(404).json({
                ok: false,
                msg: 'el usuario ya existe con ese email'
            })
        }

        //crear usuario con el modelo
        const dbUser = new Usuario( req.body );

        //hashear la contraseña/ encriptar
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync( password, salt );

        //generar el jsonWebtoken JWT
        const token = await generarJWT( dbUser.id, name)

        //Crear usuario de base de datos
        await dbUser.save();


        //Genjerar respuesta exitosa

        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token,
            email: dbUser.email           
        });

        
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            ok: true,
            msg: 'Por Favor hable con el administrador'
        })
        
    }

}


const loginUsuario = async(req, res = response) => {
   
    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });

        if( !dbUser) {

            return res.status(400).json({
                ok: false,
                msg: 'el correo no exite'
            });
        }

        //confirmar si el password hace match

        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if (!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'El passwors no es valido'
            })
        }

        //Generar el json we token
         //generar el jsonWebtoken JWT
         const token = await generarJWT( dbUser.id, dbUser.name);

         //respuesta del servcio
         return res.json({
            ok: true, 
            uid: dbUser.id,
            name: dbUser.name,
            token,
            email: dbUser.email
         })

    } catch (error) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        })
    }

}

const revalidarToken = async (req, res = response) => {

    const { uid } = req;

      //leer la base de datos
    const dbUser = await Usuario.findById( uid );
  

    const token = await generarJWT( uid, dbUser.name);   

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        token,
        email: dbUser.email                
    })


}

module.exports = {

    crearUsuario,
    loginUsuario,
    revalidarToken
}