import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const firebaseHelper = require('firebase-functions-helper');
import * as express from 'express';
import * as bodyParser from 'body-parser';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const main = express();
const app = express();

const personalDataCollection = 'personalDataCollection';

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

export const personalDataApi = functions.https.onRequest(main);

//  CRUD de la api para el ingreso de los datos del paciente

/**
 * ============== RUTAS PARA TRABAJAR CON DATOS PERSONALES DEL PACIENTE
 */

 /**
  * Metodo para insertar datos personales de un paciente
  */
 app.post('/paciente/personal', (req, res) => {
     const body = req.body;
     if(body != null) {
         firebaseHelper.firestore
            .createDocumentWithID(
                db,
                personalDataCollection,
                body.paciente_id,
                {
                    "telefono": body.telefono,
                    "tipo_de_sangre": body.tipo_de_sangre,
                    "fuma": body.fuma,
                    "drogas": body.drogas,
                    "bebidas_alcoholicas": body.bebidas_alcoholicas,
                    // TODO: proteger este dato con criptografia
                    "num_seguro_social": body.num_seguro_social,
                    "seguro_medico": body.seguro_medico,
                    "internado_hospitalario": body.internado_hospitalario,
                    "cirugia": body.cirugia,
                    "actividad_fisica": body.actividad_fisica,
                    "antecedentes_enfermedades_importantes": body.antecedentes_enfermedades_importantes
                }
            )
            .then((response:any) => {
                res
                    .status(201)
                    .send({
                        status: 'success',
                        message: 'Datos personales ingresados con exito'
                    });
            })
            .catch((error:any) => {
                res
                .send({
                    status: 'error',
                    message: 'Lo datos no se pudieron ingresar, puede que no esten bien estructurados'
                });
            })
     } else {
         res
            .send({
                status: 'error',
                message: 'Ocurrión un error tratando de insertar los datos personales'
            });
     }
 });

 /**
  * Metodo para conseguir los datos de un paciente determinado
  */
 app.get('/paciente/personal/:pacienteId', (req, res) => {
     firebaseHelper.firestore
        .checkDocumentExists(
            db, 
            personalDataCollection,
            req.params.pacienteId
        )
        .then((document:any) => {
            if(document.exists) {
                res
                .status(200)
                .send(document.data);
            } else {
                res
                    .status(404)
                    .send({
                        status: 'error',
                        message: 'El paciente aún no tiene datos personales'
                    });
            }
        });
 });
